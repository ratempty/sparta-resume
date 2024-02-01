import express from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../utils/index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import authMiddleware from "../middleware/auth.middleware.js";
import "dotenv/config";

const router = express.Router();

// 회원가입 api
router.post("/sign-up", async (req, res, next) => {
  try {
    const { name, email, password, chkPassword, isAdmin } = req.body;
    const isExistUser = await prisma.users.findFirst({
      where: { email: email },
    });

    if (isExistUser) {
      return res.status(409).json({ message: "이미 존재하는 이메일입니다." });
    }

    if (password !== chkPassword) {
      return res.status(400).json({ message: "비밀번호 확인과 다릅니다." });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "비밀번호는 6글자 이상으로 작성해야합니다." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: {
        email: email,
        name: name,
        password: hashedPassword,
        chkPassword: hashedPassword,
        isAdmin,
      },
    });
    return res.status(201).json({
      data: {
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

// 로그인 api
router.post("/sign-in", async (req, res, next) => {
  const { email, password } = req.body;

  const user = await prisma.users.findFirst({ where: { email } });

  if (!user) {
    return res.status(401).json({ message: "존재하지 않는 이메일입니다." });
  }
  if (!(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "비밀번호가 다릅니다." });
  }

  const accessToken = createAccessToken(user.userId);

  res.cookie("authorization", `Bearer ${accessToken}`);

  return res.status(200).json({ accessToken });
});

//토큰생성 함수
function createAccessToken(id) {
  return jwt.sign({ id }, process.env.CUSTOM_SECRET_KEY, {
    expiresIn: "12h",
  });
}

//내 정보 조회 api
router.get("/users", authMiddleware, async (req, res, next) => {
  const { userId } = req.user;

  const user = await prisma.users.findFirst({
    where: { userId: +userId },
    select: {
      userId: true,
      email: true,
      name: true,
    },
  });

  return res.status(200).json({ data: user });
});

export default router;
