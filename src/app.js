import express from "express";
import router from "./routes/index.js";
import cookieParser from "cookie-parser";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());
app.use("/api", router);

app.listen(PORT, () => {
  console.log(PORT, "포트로 서버 오픈");
});
