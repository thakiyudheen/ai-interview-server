import { Request, Response } from "express";
import { questionAnswerPrompt } from "../../utils/prompt/prompt";
import { ai } from "../../config/gemini";
import { ISession, SessionModel } from "../../model/session-model";
import { ObjectId } from "mongodb";

export const getQuestions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { sessionId } = req.params as Record<string, string>;

    if (!req?.user) {
      throw new Error("User is Unauthorized, please login and try");
    }

    if (!sessionId) {
      throw new Error("internal server error");
    }

    const session = await SessionModel.findOne<ISession>({
      _id: new ObjectId(sessionId),
    });
    if (!session) {
          throw new Error("session not fount with this id ");
    }

    const prompt = questionAnswerPrompt(session );

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: prompt,
    });

    const rawText = response.text;

    if (rawText) {
      const cleanedText = rawText
        .replace(/^```json/, "")
        .replace(/```$/, "")
        .trim();

      const data = JSON.parse(cleanedText);
      res.status(200).json(data);
    }

    return;
  } catch (error) {
    throw error;
  }
};
