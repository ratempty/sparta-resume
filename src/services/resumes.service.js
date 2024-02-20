export class ResumesService {
  constructor(resumesRepository) {
    this.resumesRepository = resumesRepository;
  }

  createResume = async (userId, title, content) => {
    const resume = await this.resumesRepository.createResume(
      userId,
      title,
      content
    );

    return {
      userId: resume.userId,
      title: resume.title,
      content: resume.content,
    };
  };
  findAllResumes = async (orderKey, orderValue) => {
    const resumes = await this.resumesRepository.findAllResumes(
      orderKey,
      orderValue
    );

    if (!["resumeId", "state"].includes(orderKey)) {
      throw new Error("orderKey가 올바르지 않습니다.");
    }

    if (!["asc", "desc"].includes(orderValue.toLowerCase())) {
      throw new Error("orderValue가 올바르지 않습니다.");
    }

    return resumes.map((resume) => {
      return {
        resumeId: resume.resumeId,
        title: resume.title,
        content: resume.content,
        state: resume.state,
        user: {
          name: user.name,
        },
        createdAt: resume.createdAt,
      };
    });
  };
  findResumeById = async (resumeId, userId) => {
    const resume = await this.resumesRepository.findresumeById(resumeId);

    if (userId !== resume.userId) {
      throw new Error("본인의 이력서만 조회할 수 있습니다.");
    }

    return {
      resumeId: resume.resumeId,
      userId: resume.userId,
      title: resume.title,
      content: resume.content,
      state: resume.state,
      createdAt: resume.createdAt,
      updatedAt: resume.updatedAt,
    };
  };
  updateResume = async (userId, resumeId, title, content) => {
    const resume = await this.resumesRepository.findresumeById(resumeId);

    if (userId !== resume.userId) {
      throw new Error("자신의 이력서만 수정할 수 있습니다.");
    }

    const updatedResume = await this.resumesRepository.findResumeUnique(
      resumeId,
      title,
      content
    );
    return {
      title: resume.title,
      content: resume.content,
    };
  };
  deleteResume = async (userId, resumeId) => {
    const resume = await this.resumesRepository.findresumeById(resumeId);

    if (!resume) {
      throw new Error("존재하지 않는 이력서입니다.");
    }
    if (userId !== resume.userId) {
      throw new Error("본인의 이력서만 삭제할 수 있습니다.");
    }

    await this.resumesRepository.deleteResume(resumeId);

    return { resume };
  };
}
