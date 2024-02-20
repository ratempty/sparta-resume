import jwt from "jsonwebtoken";
import { createAccessToken, createRefreshToken } from "../utils/token.js";

export class UsersController {
  constructor(usersService) {
    this.usersService = usersService;
  }

  // 회원가입
  signUp = async (req, res, next) => {
    try {
      const { name, email, password, chkPassword } = req.body;
      if (password !== chkPassword) {
        return res.status(400).json({ message: "비밀번호 확인과 다릅니다." });
      }
      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: "비밀번호는 6글자 이상으로 작성해야합니다." });
      }

      const signUpUser = await this.usersService.signUpUser({
        name,
        email,
        password,
        chkPassword,
      });

      return res
        .status(201)
        .json({ data: { email: signUpUser.email, name: signUpUser.name } });
    } catch (error) {
      console.log(error);
    }
  };
  // 로그인
  signIn = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const signInUser = await this.usersService.getUser({
        email,
        password,
      });
      const accessToken = createAccessToken(signInUser.userId);
      const refreshToken = createRefreshToken(signInUser.userId);

      res.cookie("accessToken", `Bearer ${accessToken}`);
      res.cookie("refreshToken", `Bearer ${refreshToken}`);

      return res
        .status(201)
        .json({ data: { name: signInUser.name, email: signInUser.email } });
    } catch (error) {
      console.log(error);
    }
  };

  // 내 정보 조회
  getMyInfo = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const user = await this.usersService.getUserById(userId);

      return res.status(200).json({ data: user });
    } catch (error) {
      console.log(error);
    }
  };
}
