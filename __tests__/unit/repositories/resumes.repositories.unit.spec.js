import { jest } from "@jest/globals";
import { ResumesRepository } from "../../../src/repositories/resumes.repositories";

let mockPrisma = {
  resumes: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

let resumesRepository = new ResumesRepository(mockPrisma);

describe("Resumes Repository Unit Test", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("createResume Method", async () => {
    const createResumeParams = {
      userId: "createUserId",
      title: "createTitle",
      content: "createContent",
    };

    const mockReturn = "create return string";
    mockPrisma.resumes.create.mockReturnValue(mockReturn);

    const createResumeData = await resumesRepository.createResume(
      createResumeParams.userId,
      createResumeParams.title,
      createResumeParams.content
    );

    expect(createResumeData).toBe(mockReturn);

    expect(mockPrisma.resumes.create).toHaveBeenCalledTimes(1);

    expect(mockPrisma.resumes.create).toHaveBeenCalledWith({
      data: createResumeParams,
    });
  });

  test("findAllResumes Method", async () => {
    const mockReturn = [
      {
        resumeId: 1,
        title: "Sample Resume",
        content: "sample content",
        state: "apply",
        user: {
          name: "hello world",
        },
        createdAt: new Date(),
      },
      // Add more mock data as needed
    ];

    mockPrisma.resumes.findMany.mockReturnValue(mockReturn);

    const resumes = await resumesRepository.findAllResumes();

    expect(resumesRepository.prisma.resumes.findMany).toHaveBeenCalledTimes(1);

    // You may want to adjust the expectation based on the actual data returned
    expect(resumes).toBe(mockReturn);
  });

  test("findresumeById Method", async () => {
    const resumeIdParams = 1;
    const mockReturn = {
      resumeId: resumeIdParams,
      userId: 1,
      title: "Sample Resume",
      content: "sample content",
      state: "apply",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPrisma.resumes.findUnique.mockReturnValue(mockReturn);

    const resume = await resumesRepository.findresumeById(resumeIdParams);

    expect(resumesRepository.prisma.resumes.findUnique).toHaveBeenCalledWith({
      where: {
        resumeId: resumeIdParams,
      },
    });

    expect(mockPrisma.resumes.findUnique).toHaveBeenCalledTimes(1);

    expect(resume).toBe(mockReturn);
  });

  test("findResumeUnique Method", async () => {
    const resumeParams = {
      resumeId: 1,
      title: "paramsTitle",
      content: "paramsContent",
    };
    const mockReturn = {
      resumeId: resumeParams.resumeId,
      userId: 1,
      title: resumeParams.title,
      content: resumeParams.content,
      state: "apply",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  
    mockPrisma.resumes.update.mockReturnValue(mockReturn);
  
    const resume = await resumesRepository.findResumeUnique(
      resumeParams.resumeId,
      resumeParams.title,
      resumeParams.content
    );
  
    expect(resumesRepository.prisma.resumes.update).toHaveBeenCalledWith({
      where: {
        resumeId: resumeParams.resumeId,
      },
      data: {
        title: resumeParams.title,
        content: resumeParams.content,
      },
    });
  
    expect(mockPrisma.resumes.update).toHaveBeenCalledTimes(1);
  
    expect(resume).toEqual(mockReturn);
  });

  test("deleteResume Method", async () => {
    const resumeParams = 1;
    const mockReturn = "delete return";

    mockPrisma.resumes.delete.mockReturnValue(mockReturn);

    const resume = await resumesRepository.deleteResume(resumeParams);

    expect(resumesRepository.prisma.resumes.delete).toHaveBeenCalledWith({
      where: {
        resumeId: resumeParams,
      },
    });

    expect(mockPrisma.resumes.delete).toHaveBeenCalledTimes(1);

    expect(resume).toBe(mockReturn);
  });
});
