import  express from 'express'
const  router = express.Router()
import  Appointment from '../models/AppointmentSchema.js'
import auth from '../auth/Middleware.js'
import Doctor from '../models/DoctorSchema.js'; 

router.post('/createAppointment', auth(), async (req, res) => {
  const { doctor, date, reason } = req.body;

  if (!doctor || !date || !reason) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  // تحقق من أن doctor موجود
  const doctorExists = await Doctor.findById(doctor);
  if (!doctorExists) {
    return res.status(400).json({ message: 'Invalid doctor ID' });
  }

  const appointment = await Appointment.create({
    user: req.user.id,
    doctor,
    date,
    reason,
  });

  res.status(201).json(appointment);
});





router.get('/myAppointments',auth,async(req,res)=>{
  const appointments = await Appointment.find({user: req.user._id}).populate('doctor')
  res.status(200).json(appointments)
})














router.post('/:id',async(req,res)=>{
  try{
    const {id} = req.params
    const appointment = await Appointment.findByIdAndDelete(id)
    if(!appointment){
      return res.status(404).json({message: 'Appointment not found'})
    }
    res.status(200).json({message: 'Appointment deleted successfully'})
  }catch(err){
    console.log(err)
  }
})










export default router