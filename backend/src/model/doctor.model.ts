import mongoose from "mongoose";

// export interface DoctorDocument extends mongoose.Document{
//     name: string;
//     email: string;
//     password: string;
//     speciality: string;
//     degree: string;
//     experience: number;
//     about: string;
//     fee: number;
//     address: string;
// };

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    speciality: {
        type: String,
        required: true,
    },
    degree: {
        type: String,
        required: true,
    },
    experience: {
        type: String,
        required: true,
    },
    available: {
        type: Boolean,
        default: true,
    },
    fee: {
        type: Number,
        required: true,
    },
    address: {
        type: Object,
        required: true,
    },
    about:{
        type: String, 
        required: true
    },
    
    date: {
        type: Number,
        required: true,
    },
    slots_booked: {
        type: Object,
        default: {}
    },
},{
    timestamps: true,
    minimize: false
});


const Doctor = mongoose.models.doctors || mongoose.model("doctor", doctorSchema);

export default Doctor;
