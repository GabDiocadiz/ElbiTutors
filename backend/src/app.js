import express from "express";
import cors from "cors";
// import requestLogger from './middlewares/requestLogger.js';
// import errorMiddleware from './middlewares/errorMiddleware.js';

import sessionRoutes from "./routes/sessionRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import tutorRoutes from "./routes/tutorRoutes.js";
import subjectRoutes from "./routes/subjectRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import reportRoutes from './routes/reportRoutes.js';
import feedbackRoutes from "./routes/feedbackRoutes.js";

const app = express();

// Core Middleware
app.use(express.json()); // Parses incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded requests
app.use(cors()); // Enables Cross-Origin Resource Sharing

// TODO: Implement requestLogger middleware
// app.use(requestLogger);

// Mount API Routes
app.use("/api/tutors", tutorRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/users", userRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/reports', reportRoutes);
app.use("/api/feedback", feedbackRoutes);

// Root route for API status check
app.get("/", (req, res) => {
  res.send("===== ElbiTutors API is running =====");
});

// TODO: Implement errorMiddleware
// app.use(errorMiddleware);

export default app;
