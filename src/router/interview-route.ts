import { Router } from "express";
import { authMiddleware } from "../middleware/authetication";
import { createSession } from "../controller/interview/create-session";
import { getQuestions } from "../controller/interview/get-questions";
import { getExplanation } from "../controller/interview/get-explanation";
import { getSession } from "../controller/interview/get-sessions";
import { deleteSession } from "../controller/interview/delete-session";
import { getPortfolioAnswer } from "../controller/scrap/scrap-portfolio";
const interviewRouter = Router();

interviewRouter.get("/sessions", authMiddleware, getSession);
interviewRouter.get("/sessions/:sessionId", authMiddleware, getQuestions);
interviewRouter.post("/sessions", authMiddleware, createSession);
interviewRouter.delete("/sessions/:sessionId", authMiddleware, deleteSession);
interviewRouter.get("/session/explanation", authMiddleware, getExplanation);
interviewRouter.get("/scrap", getPortfolioAnswer);
interviewRouter.get("/instagram", getPortfolioAnswer);

export default interviewRouter;
