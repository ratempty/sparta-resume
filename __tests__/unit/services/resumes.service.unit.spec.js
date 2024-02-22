import { jest } from "@jest/globals";
import { ResumesService } from "../../../src/services/resumes.service.js";

let mockresumeRepository = {
  createResume: jest.fn(),
  findAllResumes: jest.fn(),
  findresumeById: jest.fn(),
  updateResume: jest.fn(),
  findResumeUnique: jest.fn(),
  deleteResume: jest.fn(),
};

let resumesService = new ResumesService(mockresumeRepository);

describe("Resumes Service Unit Test", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("createResume Method", async () => {
    const resumeParams = {
      userId: 1,
      title: "Sample Title",
      content: "Sample Content",
    };
    const resumeSample = {
      userId: resumeParams.userId,
      title: resumeParams.title,
      content: resumeParams.content,
    };

    mockresumeRepository.createResume.mockReturnValue(resumeParams);

    const createResume = await resumesService.createResume(
      resumeSample.userId,
      resumeSample.title,
      resumeSample.content
    );

    expect(mockresumeRepository.createResume).toHaveBeenCalledTimes(1);
    expect(mockresumeRepository.createResume).toHaveBeenCalledWith(
      resumeParams.userId,
      resumeParams.title,
      resumeParams.content
    );

    expect(createResume).toEqual({
      userId: resumeParams.userId,
      title: resumeParams.title,
      content: resumeParams.content,
    });
  });

  test("findAllResumes Method", async () => {
    const resumeParams = {
      orderKey: "resumeId",
      orderValue: "desc",
    };

    const resumeSample = [
      {
        resumeId: 1,
        title: "sample title",
        content: "sample content",
        state: "apply",
        user: { name: "abc" },
        createdAt: new Date(),
      },
      {
        resumeId: 2,
        title: "sample title2",
        content: "sample content2",
        state: "apply",
        user: { name: "abc2" },
        createdAt: new Date(),
      },
    ];

    mockresumeRepository.findAllResumes.mockReturnValue(resumeSample);

    const resumes = await resumesService.findAllResumes(
      resumeParams.orderKey,
      resumeParams.orderValue
    );

    expect(mockresumeRepository.findAllResumes).toHaveBeenCalledTimes(1);
    expect(mockresumeRepository.findAllResumes).toHaveBeenCalledWith(
      resumeParams.orderKey,
      resumeParams.orderValue
    );

    expect(resumes).toEqual(
      resumeSample.map((resume) => ({
        resumeId: resume.resumeId,
        title: resume.title,
        content: resume.content,
        state: resume.state,
        name: resume.user.name,
        createdAt: resume.createdAt,
      }))
    );
  });

  test("findResumeById Method", async () => {
    const resumeParams = {
      resumeId: 1,
      userId: 1,
    };
    const resumeSample = {
      resumeId: resumeParams.resumeId,
      userId: resumeParams.userId,
      title: "제목",
      content: "자기소개",
      state: "APPLY",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockresumeRepository.findresumeById.mockReturnValue(resumeSample);

    const resume = await resumesService.findResumeById(
      resumeParams.resumeId,
      resumeParams.userId
    );

    expect(mockresumeRepository.findresumeById).toHaveBeenCalledTimes(1);
    expect(mockresumeRepository.findresumeById).toHaveBeenCalledWith(
      resumeParams.resumeId
    );

    expect(resume).toEqual({
      resumeId: resumeSample.resumeId,
      userId: resumeSample.userId,
      title: resumeSample.title,
      content: resumeSample.content,
      state: resumeSample.state,
      createdAt: resumeSample.createdAt,
      updatedAt: resumeSample.updatedAt,
    });
  });

  test("updateResume Method", async () => {
    const resumeParams_success = {
      resumeId: 1,
      userId: 1,
      title: "타이틀",
      content: "컨텐트",
    };

    const resumeParams_fail = {
      resumeId: 1,
      userId: 2,
      title: "타이틀",
      content: "컨텐트",
    };

    const unUpdatedResume = {
      resumeId: 9,
      userId: 1,
      title: "수정된 제목",
      content: "수정된 자기소개",
      state: "APPLY",
      createdAt: "2024-02-20T16:42:30.280Z",
      updatedAt: "2024-02-20T16:42:30.280Z",
    };

    mockresumeRepository.findresumeById.mockReturnValue(unUpdatedResume);

    mockresumeRepository.findResumeUnique.mockReturnValue({
      resumeId: resumeParams_success.resumeId,
      title: resumeParams_success.title,
      content: resumeParams_success.content,
      userId: unUpdatedResume.userId,
      state: unUpdatedResume.state,
      createdAt: unUpdatedResume.createdAt,
      updatedAt: unUpdatedResume.updatedAt,
    });

    const result = await resumesService.updateResume(
      resumeParams_success.resumeId,
      resumeParams_success.userId,
      resumeParams_success.title,
      resumeParams_success.content
    );

    expect(result.title).toEqual(resumeParams_success.title);
    expect(result.content).toEqual(resumeParams_success.content);

    await expect(async () => {
      await resumesService.updateResume(
        resumeParams_fail.userId,
        resumeParams_fail.resumeId,
        resumeParams_fail.title,
        resumeParams_fail.content
      );
    }).rejects.toThrowError("자신의 이력서만 수정할 수 있습니다.");

    expect(mockresumeRepository.findresumeById).toHaveBeenCalledTimes(2);
    expect(mockresumeRepository.findresumeById).toHaveBeenCalledWith(
      resumeParams_success.resumeId
    );
  });

  test("deleteResume Method", async () => {
    const resumeParams = {
      resumeId: 1,
      userId: 1,
    };

    const unDeletedResume = {
      resumeId: 1,
      userId: 1,
      title: "수정된 제목",
      content: "수정된 자기소개",
      state: "APPLY",
      createdAt: "2024-02-20T16:42:30.280Z",
      updatedAt: "2024-02-20T16:42:30.280Z",
    };

    mockresumeRepository.findresumeById.mockReturnValue(unDeletedResume);

    mockresumeRepository.deleteResume.mockReturnValue({
      resumeId: resumeParams.resumeId,
      userId: resumeParams.userId,
      title: unDeletedResume.title,
      content: unDeletedResume.content,
      state: unDeletedResume.state,
      createdAt: unDeletedResume.createdAt,
      updatedAt: unDeletedResume.updatedAt,
    });

    await expect(resumesService.deleteResume(resumeParams)).rejects.toThrow(
      "본인의 이력서만 삭제할 수 있습니다."
    );

    expect(mockresumeRepository.findresumeById).toHaveBeenCalledTimes(1);
    expect(mockresumeRepository.findresumeById).toHaveBeenCalledWith(
      resumeParams.resumeId
    );

    expect(mockresumeRepository.deleteResume).toHaveBeenCalledTimes(1);
    expect(mockresumeRepository.deleteResume).toHaveBeenCalledWith(
      resumeParams
    );
  });
});
