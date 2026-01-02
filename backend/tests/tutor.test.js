import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

// Models
import User from "../src/models/User.js";
import Tutor from "../src/models/Tutor.js";
import SubjectCatalog from "../src/models/SubjectCatalog.js";

// Controllers
import { getTutors, getTutorById, updateTutorProfile } from "../src/controllers/tutorController.js";
import { getSubjects, createSubject } from "../src/controllers/subjectController.js";

// --- 1. MOCK MIDDLEWARE ---
let mockUser = {
  _id: new mongoose.Types.ObjectId(),
  role: "tutor",
  name: "Mock Tutor"
};

const mockProtect = (req, res, next) => {
  req.user = mockUser;
  next();
};

const mockAdminOnly = (req, res, next) => {
  if (req.user.role === 'admin') next();
  else res.status(403).json({ message: "Admin only" });
};

const mockTutorOnly = (req, res, next) => {
  if (req.user.role === 'tutor') next();
  else res.status(403).json({ message: "Tutor only" });
};

// --- 2. SETUP APP & ROUTES ---
const app = express();
app.use(express.json());

// Manually mount routes with mocks to avoid importing missing authMiddleware.js
const tutorRouter = express.Router();
tutorRouter.get("/", getTutors);
tutorRouter.get("/:id", getTutorById);
tutorRouter.put("/profile", mockProtect, mockTutorOnly, updateTutorProfile);
app.use("/api/tutors", tutorRouter);

const subjectRouter = express.Router();
subjectRouter.get("/", getSubjects);
subjectRouter.post("/", mockProtect, mockAdminOnly, createSubject);
app.use("/api/subjects", subjectRouter);


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
  // Clean DB before each test
  await User.deleteMany();
  await Tutor.deleteMany();
  await SubjectCatalog.deleteMany();
});

// --- 4. THE TESTS ---

describe("Subject Catalog Logic", () => {
  
  it("should allow Admin to create a subject", async () => {
    mockUser.role = "admin"; // Switch to Admin

    const res = await request(app)
      .post("/api/subjects")
      .send({ code: "cmsC 11 ", name: "Intro to CS" }); // Messy input

    expect(res.statusCode).toBe(201);
    expect(res.body.code).toBe("CMSC 11"); // Check normalization
  });

  it("should prevent duplicate subjects", async () => {
    mockUser.role = "admin";
    await SubjectCatalog.create({ code: "MATH 17", name: "Calc" });

    const res = await request(app)
      .post("/api/subjects")
      .send({ code: "MATH 17", name: "Calc Duplicate" });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/exists/);
  });
});

describe("Tutor Controller Logic", () => {

  // Helper to seed data
  const seedTutor = async (name, bio, subjects, certified = true) => {
    const user = await User.create({ name, email: `${name.replace(/\s/g, '')}@up.edu.ph`, role: 'tutor' });
    const tutor = await Tutor.create({
      userId: user._id,
      bio,
      subjectsOffered: subjects,
      certified,
      specializationText: bio // for simple search testing
    });
    return { user, tutor };
  };

  describe("GET /api/tutors (Search & Discovery)", () => {
    it("should return all certified tutors", async () => {
      await seedTutor("John Doe", "Math Expert", ["MATH 17"]);
      await seedTutor("Jane Smith", "CS Wizard", ["CMSC 12"]);
      await seedTutor("Unverified Guy", "Newbie", [], false); // Not certified

      const res = await request(app).get("/api/tutors");

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(2); // Should exclude unverified
    });

    it("should filter by Subject", async () => {
      await seedTutor("John Math", "Math", ["MATH 17"]);
      await seedTutor("Jane CS", "CS", ["CMSC 12"]);

      const res = await request(app).get("/api/tutors?subject=CMSC 12");

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].subjectsOffered).toContain("CMSC 12");
    });

    it("should search by Keyword (Name match)", async () => {
      await seedTutor("Juan Dela Cruz", "Generic Bio", ["MATH 17"]);
      
      const res = await request(app).get("/api/tutors?keyword=Juan");
      
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(1);
      // Access populated user name to verify
      expect(res.body[0].userId.name).toBe("Juan Dela Cruz");
    });

    it("should search by Keyword (Bio match)", async () => {
      await seedTutor("Maria", "I love teaching Statistics", ["STAT 1"]);
      
      const res = await request(app).get("/api/tutors?keyword=Statistics");
      
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(1);
    });
  });

  describe("PUT /api/tutors/profile (Update)", () => {
    
    it("should allow a Tutor to update their own profile", async () => {
      // 1. Create a Tutor and set them as the logged-in mockUser
      const { user, tutor } = await seedTutor("MySelf", "Old Bio", ["MATH 17"]);
      
      mockUser = user; // Login as this user
      mockUser.role = "tutor"; 

      // 2. Send Update
      const res = await request(app)
        .put("/api/tutors/profile")
        .send({
          bio: "Updated Bio",
          subjectsOffered: ["MATH 17", "MATH 53"],
          availabilityImage: "http://calendar-link.com"
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.bio).toBe("Updated Bio");
      expect(res.body.subjectsOffered).toHaveLength(2);
    });

    it("should fail if user does not have a tutor profile", async () => {
      // Create a user but NO tutor profile entry
      const user = await User.create({ name: "Lost User", email: "lost@up.edu.ph", role: 'tutor' });
      mockUser = user;

      const res = await request(app)
        .put("/api/tutors/profile")
        .send({ bio: "Hello" });

      expect(res.statusCode).toBe(404); // "Tutor profile not found"
    });
  });
});