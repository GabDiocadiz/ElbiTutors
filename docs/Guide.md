## Introduction

This guide provides a structured overview of how to use the MERN backend technologies professionally.
It is intended for developers who are new to backend web development, particularly those who will be implementing systems using the Express.js framework, MongoDB Atlas, and supporting tools such as JWT and Cloudinary.

The focus of this guide is understanding *how to use the technologies and architectural components* that make up a modern Express backend — **not** building the organization’s web application directly.

---

## 1. Tech Stack Overview

### Express.js

Express is a minimalist Node.js web framework for building web servers and RESTful APIs. It provides routing, middleware handling, and flexible HTTP request/response management.

### MongoDB Atlas

A cloud-hosted NoSQL database that stores data as documents (JSON-like objects). MongoDB Atlas simplifies deployment, scaling, and connection management.

### Mongoose

An Object Data Modeling (ODM) library for MongoDB. It defines schemas, adds validation, and provides a structured way to interact with the database.

### JSON Web Tokens (JWT)

A secure and compact way of representing user identity. JWTs are used for authentication and authorization in stateless systems.

### Cloudinary

A media management platform for storing and serving images, videos, and other files. It integrates well with Express via the `multer-storage-cloudinary` library.

---

## 2. Project Directory Structure

A well-structured backend codebase should separate responsibilities clearly.
Below is a recommended directory layout that follows standard industry practices.

```
backend/
├─ .env
├─ package.json
├─ server.js
└─ src/
   ├─ app.js
   ├─ config/
   │  ├─ db.js
   │  ├─ cloudinary.js
   │  └─ passport.js
   ├─ models/
   │  ├─ User.js
   │  └─ Session.js
   ├─ controllers/
   │  ├─ authController.js
   │  ├─ userController.js
   │  └─ sessionController.js
   ├─ services/
   │  ├─ userService.js
   │  └─ sessionService.js
   ├─ middlewares/
   │  ├─ requestLogger.js
   │  ├─ validateBody.js
   │  ├─ authMiddleware.js
   │  ├─ roleMiddleware.js
   │  ├─ uploadMiddleware.js
   │  └─ errorMiddleware.js
   ├─ routes/
   │  ├─ authRoutes.js
   │  ├─ userRoutes.js
   │  └─ sessionRoutes.js
   └─ utils/
      └─ token.js
```

---

## 3. Environment Setup

### Required Tools

* Node.js (v18 or higher)
* Git and VS Code
* MongoDB Atlas account
* Cloudinary account
* Postman or similar API testing tool

### Dependencies

```bash
npm init -y
npm install express mongoose dotenv cors jsonwebtoken bcryptjs passport passport-google-oauth20 multer cloudinary multer-storage-cloudinary joi express-async-errors morgan helmet
npm install -D nodemon
```

### Environment Variables (`.env`)

```
PORT=4000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/elbitutors?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Add the development script in `package.json`:

```json
"scripts": { "dev": "nodemon server.js" }
```

---

## 4. Core Concepts

### 4.1 Controllers

Controllers contain the logic for handling requests.
They typically:

* Validate and parse input.
* Call a service or model function.
* Return a structured HTTP response.

### 4.2 Middleware

Middleware are reusable functions that execute before or after controllers.
They handle tasks such as logging, authentication, validation, and error handling.

### 4.3 Services

Services contain reusable business logic (e.g., database operations, computations).
They keep controllers clean and testable.

### 4.4 Models

Models define the structure and validation of data stored in MongoDB using Mongoose schemas.

---

## 5. Connecting to MongoDB Atlas

```javascript
// src/config/db.js
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('Database connection error:', err.message);
    process.exit(1);
  }
};

export default connectDB;
```

---

## 6. Example Mongoose Models

### User Model

```javascript
// src/models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: String,
  role: { type: String, enum: ['tutee', 'tutor', 'admin'], default: 'tutee' },
  avatarUrl: String
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model('User', userSchema);
```

### Session Model

```javascript
// src/models/Session.js
import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  tutor: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  bookedBy: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  topic: String,
  date: Date,
  startTime: String,
  endTime: String,
  status: { type: String, enum: ['pending', 'approved', 'done', 'cancelled'], default: 'pending' }
}, { timestamps: true });

export default mongoose.model('Session', sessionSchema);
```

---

## 7. Example Controllers and Services

### Controller Example

```javascript
// src/controllers/userController.js
import * as userService from '../services/userService.js';
import { generateToken } from '../utils/token.js';

export const register = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    const token = generateToken({ id: user._id, role: user.role });
    res.status(201).json({ user: { id: user._id, email: user.email }, token });
  } catch (err) {
    next(err);
  }
};
```

### Service Example

```javascript
// src/services/userService.js
import User from '../models/User.js';

export const createUser = async (data) => {
  const existing = await User.findOne({ email: data.email });
  if (existing) throw new Error('Email already exists');
  const user = await User.create(data);
  return user;
};
```

---

## 8. Middleware Examples

### Request Logger

```javascript
// src/middlewares/requestLogger.js
export const requestLogger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} - ${duration}ms`);
  });
  next();
};
```

### Authentication (JWT)

```javascript
// src/middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const auth = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer '))
    return res.status(401).json({ message: 'Authorization required' });

  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
```

### Request Validation

```javascript
// src/middlewares/validateBody.js
export const validateBody = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      errors: error.details.map(d => d.message)
    });
  }
  req.body = value;
  next();
};
```

### Error Handler

```javascript
// src/middlewares/errorMiddleware.js
export const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Not Found - ${req.originalUrl}`));
};

export const errorHandler = (err, req, res, next) => {
  res.status(res.statusCode || 500).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};
```

---

## 9. Routes and Request Flow

A typical route uses validation, authentication, and role-based authorization before reaching the controller.

```javascript
// src/routes/userRoutes.js
import express from 'express';
import { register } from '../controllers/userController.js';
import { validateBody } from '../middlewares/validateBody.js';
import { userSchema } from '../validation/schemas.js';

const router = express.Router();
router.post('/', validateBody(userSchema), register);
export default router;
```

Flow example:

`Client → Validation Middleware → Authentication Middleware → Controller → Service → Model → Database → Response`

---

## 10. App and Server Configuration

### app.js

```javascript
// src/app.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import userRoutes from './routes/userRoutes.js';
import { requestLogger } from './middlewares/requestLogger.js';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));
app.use(requestLogger);

app.use('/api/users', userRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
```

### server.js

```javascript
// server.js
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './src/config/db.js';
import app from './src/app.js';

const PORT = process.env.PORT || 4000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
```

---

## 11. Practice Exercises

1. **User Creation Flow**

   * Create a route for user registration using validation and service layers.
   * Test duplicate email prevention.

2. **Protected Route**

   * Build a route that requires JWT authentication and returns the logged-in user’s data.

3. **File Upload**

   * Integrate Cloudinary using `multer-storage-cloudinary` and create a route for uploading profile pictures.

4. **Custom Middleware**

   * Write a custom rate limiter middleware that restricts users to a fixed number of requests per minute.

5. **Error Testing**

   * Intentionally trigger an error in a controller and observe how the error middleware handles it.

---