import express from "express";
import upload from "../middleware/multer";
import { addDoctor, loginAdmin } from "../controllers/admin.controller";
import authAdmin from "../middleware/authAdmin";

const router = express.Router();

router.post("/add-doctor", authAdmin,  upload.single("image"), addDoctor);
router.post("/login", loginAdmin);

export default router;