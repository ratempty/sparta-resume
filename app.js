import express from "express";
import cookieParser from "cookie-parser";
import UsersRouter from "./routes/users.router.js";
import ResumesRouter from "./routes/resumes.router.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());
app.use("/api", [UsersRouter, ResumesRouter]);

app.listen(PORT, () => {
  console.log(PORT, "포트로 서버 오픈");
});
