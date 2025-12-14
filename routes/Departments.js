import  express from 'express'
const router = express.Router()
import Department from '../models/Departments.js'
import auth from  '../auth/Middleware.js'
import multer from 'multer'

const storage= multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads')
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({storage: storage})

router.post('/addDepartment',auth("admin"),upload.single('image'),async(req,res)=>{

  // if(req.user.role !== 'admin'){
  //   return res.status(401).json({message: 'You are not authorized'})
  // }
  const {name,description}= req.body
  const image = req.file ? req.file.filename : null
  if(!name){
    return res.status(400).json({message: 'Name is required'})
  }
  const department = await Department.create({
    name,
    description,
    image:req.file?.filename
  })
  res.status(201).json(department)  
})


router.get("/count",async(req,res)=>{
  try{
    const count = await Department.countDocuments()
    res.status(200).json({count})
  }
  catch(err){
    console.log(err)
  }    
})


router.get('/allDepartments',async(req,res)=>{
 try{
    const departments = await Department.find()
    res.status(200).json(departments)
 }catch(err){
    console.log(err)
 }
})

router.delete('/:id',auth("admin"),async(req,res)=>{
  try{
    const {id} = req.params
    const department = await Department.findByIdAndDelete(id)
    if(!department){
      return res.status(404).json({message: 'Department not found'})
    }
    res.status(200).json({message: 'Department deleted successfully'})
  }catch(err){
    console.log(err)
  }
})

router.put('/:id',auth("admin"),async(req,res)=>{
  try{
    const {id} = req.params
    const {name,description} = req.body
    const department = await Department.findByIdAndUpdate(id,{name,description},{new:true})
    if(!department){
      return res.status(404).json({message: 'Department not found'})
    }
    res.status(200).json(department)
  }catch(err){
    console.log(err)
  }
})


export default router