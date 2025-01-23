import express from "express";
import upload from "../middleware/multer";
import { addDoctor, adminDashboardData, allDoctors, appointmentsAdmin, cancelAppointment, loginAdmin } from "../controllers/admin.controller";
import authAdmin from "../middleware/authAdmin";
import { chageAvailability } from "../controllers/doctor.controller";

const router = express.Router();

router.post("/add-doctor", authAdmin,  upload.single("image"), addDoctor);
router.post("/login", loginAdmin);
router.get("/all-doctors", authAdmin, allDoctors);
router.post("/change-availability", authAdmin, chageAvailability);
router.get("/get-appointments", authAdmin, appointmentsAdmin);
router.post("/cancel-appointment", authAdmin, cancelAppointment);
router.get("/dashboard-data", authAdmin, adminDashboardData);

export default router;
