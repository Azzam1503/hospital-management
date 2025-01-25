import express from "express";
import { appointmentCancel, appointmentComplete, appointmentDoctor, doctorDashboard, doctorList, doctorProfile, doctorProfileUpdate, login } from "../controllers/doctor.controller";
import authDoctor from "../middleware/doctorAuth";

const router = express.Router();

router.get('/list', doctorList);
router.post('/login', login);
router.get('/get-appointments', authDoctor, appointmentDoctor);
router.post('/complete-appointment', authDoctor, appointmentComplete);
router.post('/cancel-appointment', authDoctor, appointmentCancel);
router.get('/dashboard-data', authDoctor, doctorDashboard);
router.get('/profile', authDoctor, doctorProfile);
router.put('/update-profile', authDoctor, doctorProfileUpdate);

export default router;