import express from "express";
import { bookAppointment, cancelAppointment, getProfile, listAppointment, loginUser, registerUser, updateProfile } from "../controllers/user.controller";
import authUser from "../middleware/authUser";
import upload from "../middleware/multer";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/get-profile", authUser, getProfile);
router.post("/update-profile", authUser, upload.single("image"), updateProfile);
router.post("/book-appointment", authUser, bookAppointment);
router.get("/get-appointments", authUser, listAppointment);
router.post("/cancel-appointment", authUser, cancelAppointment);

export default router;