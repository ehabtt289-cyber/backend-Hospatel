import express from "express";
import Doctor from "../models/DoctorSchema.js";
import multer from "multer";
import mongoose from "mongoose";

const router = express.Router();

// إعداد التخزين للصور
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + ext);
  },
});

const upload = multer({ storage });

// ✅ إضافة دكتور جديد
router.post("/addDoctors", upload.single("image"), async (req, res) => {
  try {
    const { name, specialty, description, experienceYears } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!name || !specialty || !description || !experienceYears || !image) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const newDoctor = new Doctor({
      name,
      specialty,
      description,
      experienceYears,
      image,
    });

    const savedDoctor = await newDoctor.save();
    res.status(201).json(savedDoctor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ عرض كل الدكاترة
router.get("/allDoctors", async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json(doctors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ عدد الدكاترة
router.get("/count", async (req, res) => {
  try {
    const count = await Doctor.countDocuments();
    res.status(200).json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ عرض دكتور واحد حسب ID (مع حماية من الخطأ)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // تحقق من أن الـ id صالح
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid doctor ID" });
    }

    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json(doctor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

router.delete("/:id",async(req,res)=>{
  try{
    const {id}=req.params
    const doctor = await Doctor.findByIdAndDelete(id)
    if(!doctor){
      return res.status(404).json({message:"Doctor not found"})
    }
    res.status(200).json({message:"Doctor deleted successfully"})        
  }catch(err){
    console.error(err);
  }
})

router.put("/:id",async(req,res)=>{
  try{
    const {id}=req.params
    const {name,specialty,description,experienceYears}=req.body
    const doctor = await Doctor.findByIdAndUpdate(id,{name,specialty,description,experienceYears},{new:true})
    if(!doctor){
      return res.status(404).json({message:"Doctor not found"})
    }
    res.status(200).json(doctor)    
  }
  catch(err){
    console.error(err);
  }
})

export default router;
