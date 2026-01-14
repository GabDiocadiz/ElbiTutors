import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../src/models/User.js";
import Tutor from "../src/models/Tutor.js";
import AuditLog from "../src/models/AuditLog.js";
import * as userController from "../src/controllers/userController.js";
import errorMiddleware from "../src/middlewares/errorMiddleware.js";
import ApiError from "../src/utils/ApiError.js";

// --- 1. MOCK AUTH ---
let mockUser = {
  _id: new mongoose.Types.ObjectId(),
  role: "tutee",
  name: "Mock User"
};

const mockProtect = (req, res, next) => {
  req.user = mockUser;
  next();
};

const mockAdminOnly = (req, res, next) => {
  if (req.user.role === 'admin' || req.user.isLRCAdmin) next();
  else next(new ApiError("Not authorized as admin", 403));
};

// --- 2. SETUP APP ---
const app = express();
app.use(express.json());
const router = express.Router();

router.get("/me", mockProtect, userController.getUserProfile);
router.put("/profile", mockProtect, userController.updateUserProfile);
router.get("/", mockProtect, mockAdminOnly, userController.getUsers);
router.post("/", mockProtect, mockAdminOnly, userController.createUser);
router.put("/:id/role", mockProtect, mockAdminOnly, userController.updateUserRole);
router.put("/:id/status", mockProtect, mockAdminOnly, userController.updateUserStatus);

app.use("/api/users", router);

// Error Middleware
app.use(errorMiddleware);

// --- 3. DB SETUP ---
let mongoServer;
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});
beforeEach(async () => {
  await User.deleteMany();
  await Tutor.deleteMany();
  await AuditLog.deleteMany();
});

// --- 4. TESTS ---
describe("User Features", () => {

  describe("Admin - Safety Checks", () => {
    let adminUser;
    beforeEach(async () => {
      adminUser = await User.create({ name: "Admin", email: "admin@up.edu.ph", role: "admin" });
      mockUser = adminUser; // Log in as Admin
    });

    it("should PREVENT Admin from suspending themselves", async () => {
      const res = await request(app)
        .put(`/api/users/${adminUser._id}/status`)
        .send({ status: "suspended" });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/own account/);
    });

    it("should PREVENT Admin from changing their own role (demotion)", async () => {
      const res = await request(app)
        .put(`/api/users/${adminUser._id}/role`)
        .send({ role: "tutee" });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/own role/);
    });

    it("should allow Admin to suspend OTHER users", async () => {
      const otherUser = await User.create({ name: "Bad", email: "bad@up.edu.ph", role: "tutee" });
      
      const res = await request(app)
        .put(`/api/users/${otherUser._id}/status`)
        .send({ status: "suspended" });

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe("suspended");
    });
  });

  describe("Admin - Account Provisioning", () => {
    beforeEach(async () => {
      mockUser = await User.create({ name: "Admin", email: "admin@up.edu.ph", role: "admin" });
    });

    it("should normalize email to lowercase when creating user", async () => {
      const res = await request(app)
        .post("/api/users")
        .send({ 
          name: "Caps User", 
          email: "CAPS@up.edu.ph", // Input with caps
          role: "tutee"
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.email).toBe("caps@up.edu.ph"); // Expect lowercase
    });

    it("should reject non-UP emails", async () => {
      const res = await request(app)
        .post("/api/users")
        .send({ 
          name: "Outsider", 
          email: "hacker@gmail.com",
          role: "tutee"
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/@up.edu.ph/);
    });
  });
  
  describe("Tutee Self-Management", () => {
    it("should allow a user to update their profile", async () => {
      // Create user and log in
      const user = await User.create({ name: "Me", email: "me@up.edu.ph", role: "tutee" });
      mockUser = user;

      const res = await request(app)
        .put("/api/users/profile")
        .send({ degree_program: "BS CS", classification: "Sophomore" });

      expect(res.statusCode).toBe(200);
      expect(res.body.degree_program).toBe("BS CS");
      
      // Verify DB update
      const updated = await User.findById(user._id);
      expect(updated.classification).toBe("Sophomore");
    });
  });

  describe("Admin Management (SRS 4.3)", () => {
    let adminUser;
    
    beforeEach(async () => {
      adminUser = await User.create({ name: "Admin", email: "admin@up.edu.ph", role: "admin" });
      mockUser = adminUser;
    });

    it("should allow Admin to list users with search", async () => {
      await User.create({ name: "Alice", email: "alice@up.edu.ph", role: "tutee" });
      await User.create({ name: "Bob", email: "bob@up.edu.ph", role: "tutee" });

      const res = await request(app).get("/api/users?keyword=Alice");
      
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].name).toBe("Alice");
    });

    it("should allow Admin to create a new Tutor (Pre-provisioning)", async () => {
      const res = await request(app)
        .post("/api/users")
        .send({ 
          name: "New Tutor", 
          email: "tutor1@up.edu.ph", 
          role: "tutor",
          degree_program: "BS Math"
        });

      expect(res.statusCode).toBe(201);
      
      // 1. Check User Created
      const user = await User.findOne({ email: "tutor1@up.edu.ph" });
      expect(user).toBeTruthy();
      expect(user.role).toBe("tutor");

      // 2. Check Tutor Profile Auto-created (SRS 4.3.3 REQ-6)
      const tutorProfile = await Tutor.findOne({ userId: user._id });
      expect(tutorProfile).toBeTruthy();
      expect(tutorProfile.certified).toBe(true);

      // 3. Check Audit Log
      const log = await AuditLog.findOne({ action: "ADMIN_CREATE_USER" });
      expect(log).toBeTruthy();
    });

    it("should allow Admin to Promote a Tutee to Tutor", async () => {
      const tutee = await User.create({ name: "Promote Me", email: "p@up.edu.ph", role: "tutee" });

      const res = await request(app)
        .put(`/api/users/${tutee._id}/role`)
        .send({ role: "tutor" });

      expect(res.statusCode).toBe(200);
      expect(res.body.role).toBe("tutor");

      // Verify Side Effect: Tutor Profile created
      const tutorProfile = await Tutor.findOne({ userId: tutee._id });
      expect(tutorProfile).toBeTruthy();
    });

    it("should allow Admin to Suspend a User", async () => {
      const target = await User.create({ name: "Bad Actor", email: "bad@up.edu.ph", role: "tutee" });

      const res = await request(app)
        .put(`/api/users/${target._id}/status`)
        .send({ status: "suspended" });

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe("suspended");

      const log = await AuditLog.findOne({ action: "ADMIN_UPDATE_STATUS" });
      expect(log).toBeTruthy();
    });

    it("should prevent non-admin from listing users", async () => {
      mockUser = { role: "tutee" }; // Demote mock user
      const res = await request(app).get("/api/users");
      expect(res.statusCode).toBe(403);
    });
  });
});
