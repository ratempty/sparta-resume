export class UsersRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  signUpUser = async ({ name, email, password, chkPassword }) => {
    const user = await this.prisma.users.create({
      data: {
        name,
        email,
        password,
        chkPassword,
      },
    });

    return user;
  };

  findUserUnique = async (email) => {
    const user = await this.prisma.users.findUnique({
      where: { email: email },
    });

    return user;
  };

  findUserById = async (userId) => {
    const user = await this.prisma.users.findUnique({
      where: { userId: +userId },
    });

    return user;
  };
}
