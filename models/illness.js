import  mongoose from 'mongoose'

const IllnessSchema =  new mongoose.Schema({
    
     name:{
        type: String,
        required: true
     },
     description:{
        type: String,
        required: true
     },
     symptoms:{
        type: String,
        required: true
     },
     treatment:{
        type: String,
        required: true
     },   
     image:{
        type: String,
        required: true
     }
  })

const Illness = mongoose.model('Illness', IllnessSchema)                                                
export default Illness
