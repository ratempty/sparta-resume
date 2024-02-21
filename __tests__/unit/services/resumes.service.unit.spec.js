import { jest } from "@jest/globals";
import { ResumesService } from "../../../src/services/resumes.service.js";

let mockresumeRepository = {
  createResume: jest.fn(),
  findAllResumes: jest.fn(),
  findresumeById: jest.fn(),
  updateResume: jest.fn(),
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
    const resumeParams = {
      resumeId: 1,
      userId: 1,
      title: '타이틀',
      content: '컨텐트'
    };
    const resumeSample = {
      title: resumeParams.title,
      content: resumeParams.content,
    };
  
    mockresumeRepository.findresumeById.mockReturnValue(resumeSample);
  
    await expect(async () => {
      await resumesService.updateResume(
        resumeParams.userId,
        resumeParams.resumeId,
        resumeParams.title,
        resumeParams.content
      );
    }).rejects.toThrowError("자신의 이력서만 수정할 수 있습니다.");
  
    expect(mockresumeRepository.findresumeById).toHaveBeenCalledTimes(1);
    expect(mockresumeRepository.findresumeById).toHaveBeenCalledWith(
      resumeParams.resumeId
    );
  });

  test("deleteResume Method", async () => {
    const resumeSample = {
      resumeId: 1,
      title: 'Title_1',
      content: 'Content_1',
      createdAt: new Date('06 October 2011 15:50 UTC'),
      updatedAt: new Date('06 October 2011 15:50 UTC'),
    };
    const mockReturn = 'delete'
    mockresumeRepository.findPostById.mockReturnValue(resumeSample);

    const deletePost = await postsService.deletePost(1);

    expect(mockresumeRepository.findPostById).toHaveBeenCalledTimes(1);
    expect(mockresumeRepository.findPostById).toHaveBeenCalledWith(
      samplePost.postId,
    );
    expect(mockresumeRepository.deletePost).toHaveBeenCalledTimes(1);
    expect(mockresumeRepository.deletePost).toHaveBeenCalledWith(
      samplePost.postId,
      samplePost.password,
    );

    expect(deletePost).toEqual({mockReturn});
  })
})