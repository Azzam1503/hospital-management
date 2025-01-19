import dotenv from "dotenv";
import express, {Application, Request, Response} from "express";
dotenv.config();
import connectDB from "./config/connectDB";
const app: Application = express();
const PORT = process.env.PORT || 3000;
import cors from "cors";
import connectCloudinary from "./config/cloudinary";
import adminRoutes from "./route/admin.route";
import doctorRoutes from "./route/doctor.route";
import userRoutes from "./route/user.route";

connectDB();
connectCloudinary();

app.use(cors());
app.use(express.json());
app.get("/", (req: Request, res: Response) => {
    res.send("Hello there");
});

app.use("/api/admin", adminRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/user", userRoutes);

app.listen(3000, () => {
    console.log(`server is running on PORT ${PORT}`);
}) 