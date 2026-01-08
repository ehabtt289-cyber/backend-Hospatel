import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors';

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;

// CORS setup
app.use(cors({
  origin: ['https://frontend-hospatel-nky3.vercel.app','https://746b9f9e-6613-4a02-982f-e383b93d42bf-00-3dqja0ihskin7.pike.replit.dev:3000'],
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
import Illness from './routes/illness.js';

// Routes
app.use('/user', User);
app.use('/doctors', Doctor);
app.use('/appointment', Appointment);
app.use('/departments', Department);
app.use("/uploads", express.static("uploads"));
app.use('/illness', Illness)

  
// send requset to the srever in 5 minutes
app.get('/api/health', (req , res)=>{
   console.log(`Se`)
    res.status(200).send('ok')
})


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
