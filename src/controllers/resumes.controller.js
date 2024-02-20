export class ResumesController {
  constructor(resumesService) {
    this.resumesService = resumesService;
  }
  // 이력서 등록
  createResume = async (req, res, next) => {
    try {
      const { title, content } = req.body;
      const { userId } = req.user;

      const createResume = await this.resumesService.createResume(
        userId,
        title,
        content
      );

      return res.status(201).json({ data: createResume });
    } catch (error) {
      console.log(error);
    }
  };
  // 이력서 전체조회
  getResumes = async (req, res, next) => {
    try {
      const orderKey = req.query.orderKey ?? "resumeId";
      const orderValue = req.query.orderValue ?? "desc";

      const resumes = await this.resumesService.findAllResumes(
        orderKey,
        orderValue
      );

      return res.status(200).json({ data: resumes });
    } catch (error) {
      console.log(error);
    }
  };
  // 이력서 상세조회
  getResumesById = async (req, res, next) => {
    try {
      const { resumeId } = req.params;
      const { userId } = req.user;

      const resume = await this.resumesService.findResumeById(resumeId, userId);

      return res.status(200).json({ data: resume });
    } catch (error) {
      console.log(error);
    }
  };
  // 이력서 수정
  updateResume = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { resumeId } = req.params;
      const { title, content } = req.body;

      const updatedResume = await this.resumesService.updateResume(
        userId,
        resumeId,
        title,
        content
      );

      return res.status(200).json({ data: updatedResume });
    } catch (error) {
      console.log(error);
    }
  };
  // 이력서 삭제
  deleteResume = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { resumeId } = req.params;

      const deletedResume = await this.resumesService.deleteResume(
        userId,
        resumeId
      );

      return res.status(200).json({ message: "이력서 삭제 완료" });
    } catch (error) {
      console.log(error);
    }
  };
}
