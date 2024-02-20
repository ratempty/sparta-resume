import express from "express";
import { prisma } from "../utils/index.js";
import { ResumesRepository } from "../repositories/resumes.repositories.js";
import { ResumesService } from "../services/resumes.service.js";
import { ResumesController } from "../controllers/resumes.controller.js";

const router = express.Router();

const resumesRepository = new ResumesRepository(prisma);
const resumesService = new ResumesService(resumesRepository);
const resumesController = new ResumesController(resumesService);

// 이력서 등록 api
router.post("/", resumesController.createResume);

// 이력서 전체조회 api
router.get("/", resumesController.getResumes);

//이력서 상세조회 api
router.get("/:resumeId", resumesController.getResumesById);

// 이력서 수정 api
router.patch("/:resumeId", resumesController.updateResume);

//이력서 삭제 api
router.delete("/:resumeId", resumesController.deleteResume);

export default router;
