import bcrypt from "bcrypt";

export class UsersService {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }

  signUpUser = async ({ name, email, password, chkPassword }) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersRepository.signUpUser({
      name,
      email,
      password: hashedPassword,
      chkPassword: hashedPassword,
    });

    return {
      email: user.email,
      name: user.name,
    };
  };

  getUser = async ({ email, password }) => {
    const user = await this.usersRepository.findUserUnique(email);

    if (!user) throw new Error("로그인 정보가 틀립니다.");

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new Error("비밀번호가 다릅니다.");
    }

    return {
      name: user.name,
      email: user.email,
      userId: user.userId,
    };
  };

  getUserById = async ( userId ) => {
    const user = await this.usersRepository.findUserById(userId);

    return {
      userId: user.userId,
      name: user.name,
      email: user.email,
    };
  };
}
