import express from "express";
import upload from "../middleware/multer";
import { addDoctor, allDoctors, loginAdmin } from "../controllers/admin.controller";
import authAdmin from "../middleware/authAdmin";
import { chageAvailability } from "../controllers/doctor.controller";

const router = express.Router();

router.post("/add-doctor", authAdmin,  upload.single("image"), addDoctor);
router.post("/login", loginAdmin);
router.get("/all-doctors", authAdmin, allDoctors);
router.post("/change-availability", authAdmin, chageAvailability);

export default router;
