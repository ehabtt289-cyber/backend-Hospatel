import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors';

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;

// CORS setup
app.use(cors({
  origin: 'https://746b9f9e-6613-4a02-982f-e383b93d42bf-00-3dqja0ihskin7.pike.replit.dev:3000',
  methods: ['GET','POST','DELETE','PUT','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

app.use(express.json());
connectDB();

// Import Routes
import User from './routes/user.js';
import Doctor from './routes/doctor.js';
import Appointment from './routes/appointment.js';
import Department from './routes/Departments.js';

// Routes
app.use('/user', User);
app.use('/doctors', Doctor);
app.use('/appointment', Appointment);
app.use('/departments', Department);
app.use("/uploads", express.static("uploads"));

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
