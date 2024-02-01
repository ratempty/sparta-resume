import express from "express";
import { prisma } from "../utils/index.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// 이력서 등록 api
router.post("/resumes", authMiddleware, async (req, res, next) => {
  const { title, content } = req.body;
  const { userId } = req.user;

  if (!userId) {
    return res.status(401).json({ errorMessage: "로그인이 필요합니다." });
  }

  await prisma.resumes.create({
    data: {
      userId: +userId,
      title: title,
      content: content,
    },
  });

  return res.status(201).json({ message: "이력서 등록 완료" });
});

// 이력서 전체조회 api
router.get("/resumes", authMiddleware, async (req, res, next) => {
  const { orderKey, orderValue } = req.query;
  const { userId, isAdmin } = req.user;

  if (userId !== +orderKey && !isAdmin) {
    return res
      .status(403)
      .json({ message: "본인의 이력서만 조회 할 수 있습니다." });
  }

  const name = await prisma.users.findFirst({
    where: {
      userId: +orderKey,
    },
    select: {
      name: true,
    },
  });

  const resumes = await prisma.resumes.findMany({
    where: {
      userId: +orderKey,
    },
    select: {
      resumeId: true,
      title: true,
      content: true,
      state: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: orderValue,
    },
  });

  const resumesPlusName = resumes.map((resume) => {
    return {
      ...resume,
      name: name.name,
    };
  });

  return res.status(200).json({
    data: { resumes: resumesPlusName },
  });
});

//이력서 상세조회 api
router.get("/resumes/:resumeId", authMiddleware, async (req, res, next) => {
  const { resumeId } = req.params;
  const { userId, isAdmin } = req.user;

  const userResume = await prisma.resumes.findFirst({
    where: { resumeId: +resumeId },
  });

  if (!isAdmin && userId !== userResume.userId) {
    return res
      .status(403)
      .json({ message: "본인의 이력서만 조회할 수 있습니다." });
  }
  const resume = await prisma.resumes.findFirst({
    where: {
      resumeId: +resumeId,
    },
    select: {
      resumeId: true,
      userId: true,
      title: true,
      content: true,
      state: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return res.status(200).json({ data: resume });
});

// 이력서 수정 api
router.patch("/resumes/:resumeId", authMiddleware, async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { resumeId } = req.params;
    const { title, content } = req.body;

    const existResume = await prisma.resumes.findUnique({
      where: {
        resumeId: +resumeId,
      },
    });

    if (!existResume) {
      return res.status(404).json({ message: "이력서 조회에 실패했습니다." });
    }
    if (existResume.userId !== userId) {
      return res
        .status(403)
        .json({ message: "자신의 이력서만 수정할 수 있습니다." });
    }

    const updateResume = await prisma.resumes.update({
      where: {
        resumeId: +resumeId,
      },
      data: {
        title: title,
        content: content,
      },
    });

    return res.status(200).json({ message: "이력서 수정 완료", updateResume });
  } catch (error) {
    console.log(error);
  }
});

//이력서 삭제 api
router.delete("/resumes/:resumeId", authMiddleware, async (req, res, next) => {
  const { userId } = req.user;
  const { resumeId } = req.params;

  const existResume = await prisma.resumes.findUnique({
    where: {
      resumeId: +resumeId,
    },
  });
  if (!existResume) {
    return res.status(404).json({ message: "이력서 조회에 실패했습니다." });
  }
  if (existResume.userId !== userId) {
    return res
      .status(403)
      .json({ message: "자신의 이력서만 삭제할 수 있습니다." });
  }

  await prisma.resumes.delete({
    where: {
      resumeId: +resumeId,
    },
  });

  return res.status(204).json({ message: "이력서 삭제 완료!" });
});
export default router;
