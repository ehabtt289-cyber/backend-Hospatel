import express from "express";
import mongoose from "mongoose";
import Illness from "../models/illness.js";  
const router = express.Router();
import auth from "../auth/Middleware.js";
import multer from "multer";

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

router.post("/addIllness", upload.single("image"), auth("admin"), async (req, res) =>{
  try{
    const {name,description,symptoms,treatment} = req.body;
    const image = req.file ? req.file.filename : null;
    if(!name || !description || !symptoms || !treatment || !image) {
      return res.status(400).json({message: "Please fill all fields"});
    }
    const newIllness = new Illness({
      name,
      description,
      symptoms,
      treatment,
      image
    });
    const savedIllness = await newIllness.save();
    res.status(201).json(savedIllness);
  }catch(err){
    console.error(err);
    res.status(500).json({message: "Server Error"});
  }
})

router.get("/allIllness", async (req, res) =>{
  try{
    const illness = await Illness.find();
    res.status(200).json(illness);
  }
  catch(err){
     console.error(err);
     res.status(500).json({message: "Server Error"});
  }
})

router.get("/count", async (req, res) =>{
  try{
    const count = await Illness.countDocuments();
    
    res.status(200).json({count});                          
  }catch(e){
    console.error(err);
  }
})

router.get('/:id', async (req, res) =>{
  try{
    const {id} = req.params;
    const illness = await Illness.findById(id);
    if(!illness){
      return res.status(404).json({message: "Illness not found"});
    }
    res.status(200).json(illness);
  }catch(err){
    console.error(err);
  }
})

router.delete("/:id", async (req, res) =>{
  try{
    const {id} = req.params;
    const illness = await Illness.findByIdAndDelete(id);
    if(!illness){
      return res.status(404).json({message: "Illness not found"});
    }
    res.status(200).json({message: "Illness deleted successfully"});
  }catch(err){
    console.error(err);
  }
})

router.put("/:id", async (req, res) =>{
  try{
    const {id} = req.params;
    const {name,description,symptoms,treatment} = req.body;
    const illness = await Illness.findByIdAndUpdate(id,{name,description,symptoms,treatment},{new:true});
    if(!illness){
      return res.status(404).json({message: "Illness not found"});
    }
    res.status(200).json(illness);
  }catch(err){
    console.error(err);
  }
})



router.get("/:id", async (req, res) =>{
  try{
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(400).json({message: "Invalid illness ID"});
    }
    const illness = await Illness.findById(id);
    if(!illness){
      return res.status(404).json({message: "Illness not found"});
    }
    res.status(200).json(illness);
  }catch(err){
     console.error(err);
     res.status(500).json({message: "Server Error"});
  }
})




export default router;
