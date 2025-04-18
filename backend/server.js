import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import signupRoutes from './routes/signup.js';
import loginRoutes from './routes/login.js';
import adminRoutes from './routes/admin.js';
import doctorRoutes from './routes/doctor.js';
import patientRoutes from './routes/patient.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Required for __dirname equivalent in ES modules
// const __filename = fileURLToPath(import.meta.url);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// const __dirname = path.resolve();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000", 
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Could not connect to MongoDB', err));

// Routes
app.use('/api/signup', signupRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/patient', patientRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
