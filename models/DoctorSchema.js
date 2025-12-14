import  mongoose from 'mongoose'

const  DoctorSchema = new mongoose.Schema({
  name:String,
  specialty:String,
  image:String,  
  description:String,
  experienceYears:Number,
  email:String,
  phone:String,
  address:String,
  
})
const Doctor = mongoose.model('Doctor', DoctorSchema)
export default Doctor