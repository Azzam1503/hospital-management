import express from "express";
import { getProfile, loginUser, registerUser, updateProfile } from "../controllers/user.controller";
import authUser from "../middleware/authUser";
import upload from "../middleware/multer";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/get-profile", authUser, getProfile);
router.post("/update-profile", authUser, upload.single("image"), updateProfile);

export default router;