import { jest } from "@jest/globals";
import { ResumesService } from "../../../src/services/resumes.service.js";

let mockresumeRepository = {
  createResume: jest.fn(),
  findAllResumes: jest.fn(),
  findResumeById: jest.fn(),
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

  test('findAllResumes Method' , async ()=>{
    const resumeParams = {
      orderKey : 'resumeId',
      orderValue : 'desc'
    };
    const resumeSample
  })
});
