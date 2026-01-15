import express from "express";
import cors from "cors";
import requestLogger from './middlewares/requestLogger.js';
import errorMiddleware from './middlewares/errorMiddleware.js';

import sessionRoutes from "./routes/sessionRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import tutorRoutes from "./routes/tutorRoutes.js";
import subjectRoutes from "./routes/subjectRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import reportRoutes from './routes/reportRoutes.js';
import feedbackRoutes from "./routes/feedbackRoutes.js";
import auditLogRoutes from "./routes/auditLogRoutes.js";

const app = express();
app.use(cors({
  origin: 'http://localhost:5173', // Allow your Frontend
  credentials: true,               // Allow cookies/tokens
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Core Middleware
app.use(express.json()); // Parses incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded requests
// app.use(cors()); // Enables Cross-Origin Resource Sharing

app.use(requestLogger);

// Rate Limiting
import rateLimit from 'express-rate-limit';
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Mount API Routes
app.use("/api/tutors", tutorRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/users", userRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/reports', reportRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/audit-logs", auditLogRoutes);

// Root route for API status check
app.get("/", (req, res) => {
  res.send("===== ElbiTutors API is running =====");
});

// Implement errorMiddleware
app.use(errorMiddleware);

export default app;
