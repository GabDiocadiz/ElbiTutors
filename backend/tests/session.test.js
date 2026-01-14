import request from "supertest"; // Simulates HTTP requests
import express from "express";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Session from "../src/models/Session.js"; // Your Model
import User from "../src/models/User.js";
import errorMiddleware from "../src/middlewares/errorMiddleware.js";
import ApiError from "../src/utils/ApiError.js";

// --- 1. MOCK AUTH MIDDLEWARE ---
// We overwrite the 'protect' and 'adminOnly' middleware logic here.
// This allows us to switch users (Tutee vs Admin) dynamically.

let mockUser = {
  _id: new mongoose.Types.ObjectId(), // Random ID
  role: "tutee",
  name: "Test Tutee"
};

const mockProtect = (req, res, next) => {
  req.user = mockUser; // Inject the fake user
  next();
};

const mockAdminOnly = (req, res, next) => {
  if (req.user.role === 'admin' || req.user.isLRCAdmin) {
    next();
  } else {
    next(new ApiError("Not authorized as Admin", 403));
  }
};

// --- 2. SETUP APP ---
const app = express();
app.use(express.json());

// We must bypass the REAL middleware imports in sessionRoutes
// But since we can't easily rewire ESM imports, we will manually mount
// the CONTROLLERS directly or use a specific test-route setup.
// BETTER APPROACH FOR TESTING: 
// We will manually apply the mocks BEFORE mounting the router.
// Note: This relies on sessionRoutes NOT applying middleware globally, 
// or us overwriting it. 
// Since your sessionRoutes imports the real middleware, we will trick it 
// by intercepting the routes. 
// However, the cleanest way in a unit test without complex mocking libraries
// is to redefine the routes locally using your imported controllers.

import { bookSession, updateSessionStatus } from "../src/controllers/sessionController.js";

// Recreate the router logic with MOCKED middleware
const testRouter = express.Router();
testRouter.post("/", mockProtect, bookSession);
testRouter.put("/:id/status", mockProtect, mockAdminOnly, updateSessionStatus);
app.use("/api/sessions", testRouter);

// Apply Global Error Middleware to Test App
app.use(errorMiddleware);


// --- 3. DATABASE SETUP ---
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Clear database and reset mock user before every test
  await Session.deleteMany();
  mockUser = {
    _id: new mongoose.Types.ObjectId(),
    role: "tutee",
    name: "Test Tutee"
  };
});

// --- 4. THE TESTS ---

describe("Session Controller Logic", () => {
  
  const tutorId = new mongoose.Types.ObjectId();
  // Helper to get future dates
  const getFutureDate = (hoursToAdd) => {
    const date = new Date();
    date.setHours(date.getHours() + hoursToAdd);
    return date;
  };

  describe("POST /api/sessions (Booking)", () => {
    
    it("should successfully book a valid session", async () => {
      const res = await request(app)
        .post("/api/sessions")
        .send({
          tutorId,
          topic: "Math 101",
          startTime: getFutureDate(1),
          endTime: getFutureDate(2),
          isGroup: false
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe("pending");
      expect(res.body.participants[0].userId).toBe(mockUser._id.toString());
    });

    it("should prevent booking in the past", async () => {
      const pastDate = new Date();
      pastDate.setFullYear(2020);

      const res = await request(app)
        .post("/api/sessions")
        .send({
          tutorId,
          startTime: pastDate,
          endTime: getFutureDate(1)
        });

      expect(res.statusCode).toBe(400); // Bad Request
      expect(res.body.message).toMatch(/past/i);
    });

    it("should prevent start time being after end time", async () => {
      const res = await request(app)
        .post("/api/sessions")
        .send({
          tutorId,
          startTime: getFutureDate(3),
          endTime: getFutureDate(2) // End is before start
        });

      expect(res.statusCode).toBe(400);
    });

    it("should detect overlapping sessions (Double Booking)", async () => {
      // 1. Create first session (10:00 - 12:00)
      const start = getFutureDate(5);
      const end = getFutureDate(7);
      
      await Session.create({
        tutorId,
        createdByTuteeId: new mongoose.Types.ObjectId(),
        startTime: start,
        endTime: end,
        status: "approved" // Simulate an existing approved session
      });

      // 2. Try to book overlapping (11:00 - 13:00)
      const overlapStart = getFutureDate(6); // Inside the previous slot
      const overlapEnd = getFutureDate(8);

      const res = await request(app)
        .post("/api/sessions")
        .send({
          tutorId,
          startTime: overlapStart,
          endTime: overlapEnd
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/already booked/i);
    });
    it("should allow consecutive sessions (one starts exactly when another ends)", async () => {
      // 1. Create Session A (10:00 - 11:00)
      const startA = getFutureDate(1);
      const endA = getFutureDate(2);
      
      await Session.create({
        tutorId,
        createdByTuteeId: mockUser._id,
        startTime: startA,
        endTime: endA,
        status: "approved"
      });

      // 2. Book Session B (11:00 - 12:00)
      // Note: StartB equals EndA. This should be allowed.
      const startB = endA; 
      const endB = getFutureDate(3);

      const res = await request(app)
        .post("/api/sessions")
        .send({
          tutorId,
          startTime: startB,
          endTime: endB
        });

      expect(res.statusCode).toBe(201); // Created
    });
    
    it("should enforce group participant limits", async () => {
      const res = await request(app)
        .post("/api/sessions")
        .send({
          tutorId,
          startTime: getFutureDate(10),
          endTime: getFutureDate(11),
          isGroup: true,
          participantsCount: 10 // SRS Limit is 5
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/between 2 and 5/i);
    });
  });

  describe("PUT /api/sessions/:id/status (Admin Approval)", () => {

   it("should allow an Admin to approve a session", async () => {
      // --- 1. CREATE "REAL" USERS IN DB ---
      // We explicitly create these docs so MongoDB can find them later
      const tutorDoc = await User.create({
        name: "Test Tutor",
        email: "tutor@up.edu.ph",
        role: "tutor",
        isLRCAdmin: false
      });

      const tuteeDoc = await User.create({
        name: "Test Tutee",
        email: "tutee@up.edu.ph",
        role: "tutee",
        isLRCAdmin: false
      });

      // --- 2. CREATE THE SESSION LINKED TO THEM ---
      // We use the ._id from the users we just created
      const session = await Session.create({
        tutorId: tutorDoc._id,         // valid reference
        createdByTuteeId: tuteeDoc._id, // valid reference
        startTime: getFutureDate(1),
        endTime: getFutureDate(2),
        status: "pending",
        participants: [{ userId: tuteeDoc._id }]
      });

      // --- 3. SWITCH THE ACTOR TO ADMIN ---
      // This mocks the person clicking the button (req.user)
      mockUser.role = "admin";
      mockUser.isLRCAdmin = true;

      // --- 4. PERFORM THE ACTION ---
      const res = await request(app)
        .put(`/api/sessions/${session._id}/status`)
        .send({ status: "approved" });

      // --- 5. ASSERTIONS ---
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe("approved");
      expect(res.body.approvedByAdminId).toBe(mockUser._id.toString());
      
      // Verify data integrity (Optional)
      expect(res.body.tutorId._id).toBe(tutorDoc._id.toString());
    });

    it("should block a Tutee from approving a session", async () => {
       // 1. Create a pending session
       const session = await Session.create({
        tutorId,
        createdByTuteeId: mockUser._id,
        startTime: getFutureDate(1),
        endTime: getFutureDate(2),
        status: "pending"
      });

      // 2. Ensure role is Tutee (Default)
      mockUser.role = "tutee";

      // 3. Make request
      const res = await request(app)
        .put(`/api/sessions/${session._id}/status`)
        .send({ status: "approved" });

      expect(res.statusCode).toBe(403); // Forbidden
    });
  });
});