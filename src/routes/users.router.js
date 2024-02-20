import express from "express";
import { prisma } from "../utils/index.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { UsersController } from "../controllers/users.controller.js";
import { UsersRepository } from "../repositories/users.repositories.js";
import { UsersService } from "../services/users.service.js";

const router = express.Router();

const usersRepository = new UsersRepository(prisma);
const usersService = new UsersService(usersRepository);
const usersController = new UsersController(usersService);

// 회원가입 api
router.post("/sign-up", usersController.signUp);

// 로그인 api
router.post("/sign-in", usersController.signIn);

//내 정보 조회 api
router.get("/", authMiddleware, usersController.getMyInfo);

export default router;
