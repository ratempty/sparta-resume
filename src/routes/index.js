import express from "express";
import resumesRouter from "./resumes.router.js";
import usersRouter from "./users.router.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.use("/users", usersRouter);
router.use("/resumes", authMiddleware, resumesRouter);

export default router;
