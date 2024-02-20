export class ResumesRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  createResume = async (userId, title, content) => {
    const createResume = await this.prisma.resumes.create({
      data: {
        userId,
        title,
        content,
      },
    });
    return createResume;
  };
  findAllResumes = async (orderKey, orderValue) => {
    const resumes = await this.prisma.resumes.findMany({
      select: {
        resumeId: true,
        title: true,
        content: true,
        state: true,
        user: {
          select: {
            name: true,
          },
        },
        createdAt: true,
      },
      orderBy: [
        {
          [orderKey]: orderValue,
        },
      ],
    });
    return resumes;
  };
  findresumeById = async (resumeId) => {
    const resume = await this.prisma.resumes.findFirst({
      where: { resumeId: +resumeId },
    });

    return resume;
  };
  findResumeUnique = async (resumeId, title, content) => {
    const updateResume = await this.prisma.resumes.findFirst({
      where: { resumeId: +resumeId },
      data: {
        title,
        content,
      },
    });
    return updateResume;
  };
  deleteResume = async (resumeId) => {
    const deletedResume = await this.prisma.resumes.delete({
      resumeId: +resumeId,
    });

    return deletedResume;
  };
}
