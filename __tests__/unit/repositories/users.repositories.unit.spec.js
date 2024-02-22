import { jest } from "@jest/globals";
import { UsersRepository } from "../../../src/repositories/users.repositories";

let mockPrisma ={
  users :{
    create: jest.fn(),
    findUnique: jest.fn()
  }
}

let usersRepository = new UsersRepository(mockPrisma)

describe("users repository unit test" , ()=>{
  beforeEach(()=>{
    jest.resetAllMocks();
  })

  test('signUpUser Method' , async ()=>{
    const params = { name :'rrrera', email :'aa', password:'r7m0G', chkPassword:'r7m0G' }
    const result = {
      email: 'aa',
      password: 'r7m0G',
      name: 'rrrera',
      chkPassword: 'r7m0G'
    }

    mockPrisma.users.create.mockReturnValue(result);

    const createdUser = await usersRepository.signUpUser(params)

    expect(createdUser).toBe(result)

    expect(mockPrisma.users.create).toHaveBeenCalledTimes(1);
    expect(mockPrisma.users.create).toHaveBeenCalledWith({
      data: result
    })
  })
})