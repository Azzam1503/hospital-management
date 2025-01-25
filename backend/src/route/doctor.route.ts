import express from "express";
import { appointmentDoctor, doctorList, login } from "../controllers/doctor.controller";
import authDoctor from "../middleware/doctorAuth";

const router = express.Router();

router.get('/list', doctorList);
router.post('/login', login);
router.get('/get-appointments', authDoctor, appointmentDoctor);

export default router;