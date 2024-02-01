import jwt from "jsonwebtoken";
import { prisma } from "../utils/index.js";

export default async function (req, res, next) {
  try {
    const { authorization } = req.cookies;
    if (!authorization) throw new Error("토큰이 없습니다.");

    const [tokenType, token] = authorization.split(" ");
    if (tokenType !== "Bearer") throw new Error("토큰 타입이 틀립니다.");

    const decodedToken = jwt.verify(token, "custom-secret-key");
    const userId = decodedToken.id;

    const user = await prisma.users.findFirst({
      where: { userId: +userId },
    });

    if (!user) throw new Error("토큰 사용자 없음!");

    req.user = user;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError")
      return res.status(401).json({ message: "토큰만료!" });
    if (error.name === "JsonWebTokenError")
      return res.status(401).json({ message: "토큰이 조작되었습니다." });
    return res.status(400).json({ message: error.message });
  }
}