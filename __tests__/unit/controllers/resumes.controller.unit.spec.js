import { beforeEach, jest } from "@jest/globals";
import { ResumesController } from "../../../src/controllers/resumes.controller";

const mockResumesService = {
  createResume: jest.fn(),
  findAllResumes: jest.fn(),
  findResumeById: jest.fn(),
  updateResume: jest.fn(),
  deleteResume: jest.fn(),
};

const mockRequest = {
  body: jest.fn(),
  user: jest.fn(),
  query: jest.fn(),
  params: jest.fn(),
};
const mockResponse = { status: jest.fn(), json: jest.fn() };
const mockNext = jest.fn();

const resumesController = new ResumesController(mockResumesService);

describe("Resumes Controller Unit Test", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockResponse.status.mockReturnValue(mockResponse);
  });

  test("createResume method", async () => {
    const reqParams = {
      title: "제목",
      content: "내용",
    };

    mockRequest.body = reqParams;
    mockRequest.user = { userId: 1 };

    const result = {
      userId: 1,
      title: "제목",
      content: "내용",
    };

    mockResumesService.createResume.mockReturnValue(result);

    await resumesController.createResume(mockRequest, mockResponse, mockNext);

    expect(mockResumesService.createResume).toHaveBeenCalledWith(
      mockRequest.user.userId,
      reqParams.title,
      reqParams.content
    );
    expect(mockResumesService.createResume).toHaveBeenCalledTimes(1);

    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(201);

    expect(mockResponse.json).toHaveBeenCalledWith({
      data: result,
    });
  });

  test("getResumes method", async () => {
    const reqQueries = {
      orderKey: "resumeId",
      orderValue: "desc",
    };

    const result = [
      {
        resumeId: 1,
        title: "수정된 제목",
        content: "수정된 자기소개",
        state: "APPLY",
        name: "rrrera",
        createdAt: new Date(),
      },
      {
        resumeId: 2,
        title: "12 제목",
        content: "12 자기소개",
        state: "APPLY",
        name: "rrrera11",
        createdAt: new Date(),
      },
    ];

    const orderKey = reqQueries.orderKey;
    const orderValue = reqQueries.orderValue;

    mockResumesService.findAllResumes.mockReturnValue(result);

    await resumesController.getResumes(mockRequest, mockResponse, mockNext);

    expect(mockResumesService.findAllResumes).toHaveBeenCalledWith(
      orderKey,
      orderValue
    );

    expect(mockResumesService.findAllResumes).toHaveBeenCalledTimes(1);

    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);

    expect(mockResponse.json).toHaveBeenCalledWith({ data: result });
  });

  test("getResumesById method", async () => {
    const reqParams = { resumeId: 1 };
    const result = {
      resumeId: 1,
      userId: 1,
      title: "제목",
      content: "내용",
      state: "apply",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockRequest.params = reqParams;
    mockRequest.user = { userId: 1 };

    mockResumesService.findResumeById.mockReturnValue(result);

    await resumesController.getResumesById(mockRequest, mockResponse, mockNext);

    expect(mockResumesService.findResumeById).toHaveBeenCalledWith(
      reqParams.resumeId,
      mockRequest.user.userId
    );

    expect(mockResumesService.findResumeById).toHaveBeenCalledTimes(1);

    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);

    expect(mockResponse.json).toHaveBeenCalledWith({ data: result });
  });

  test('updateResume Method' , async ()=>{
    const reqParams = { resumeId : 1 }
    const reqBody = { title : '제목' , content : '내용'}
    const result = {title : '제목' , content : '내용'}

    mockRequest.user = { userId: 1 };
    mockRequest.params = reqParams;
    mockRequest.body = reqBody;

    mockResumesService.updateResume.mockReturnValue(result);

    await resumesController.updateResume(mockRequest, mockResponse, mockNext);

    expect(mockResumesService.updateResume).toHaveBeenCalledWith(
      reqParams.resumeId,
      mockRequest.user.userId,
      mockRequest.body.title,
      mockRequest.body.content
    );

    expect(mockResumesService.updateResume).toHaveBeenCalledTimes(1);

    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);

    expect(mockResponse.json).toHaveBeenCalledWith({ data: result });
  })

  test('deleteResume Method' , async ()=>{
    const reqParams = { resumeId : 1 }
    const result = { message: "이력서 삭제 완료" }

    mockRequest.user = { userId: 1 };
    mockRequest.params = reqParams;

    mockResumesService.deleteResume.mockReturnValue(result);

    await resumesController.deleteResume(mockRequest, mockResponse, mockNext);

    expect(mockResumesService.deleteResume).toHaveBeenCalledWith(
      reqParams.resumeId,
      mockRequest.user.userId
    );

    expect(mockResumesService.deleteResume).toHaveBeenCalledTimes(1);

    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);

    expect(mockResponse.json).toHaveBeenCalledWith(result);
  })
});
