import express from "express";
import userRoutes from "./user/user.route";
import fileRoutes from "./file/file.route"

// routes
const router = express.Router();

router.use("/users", userRoutes);
router.use("/files", fileRoutes);

export default router;