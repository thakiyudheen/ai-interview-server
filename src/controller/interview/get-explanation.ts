import { Request, Response } from "express";
import { conceptExplainPrompt } from "../../utils/prompt/prompt";
import { ai } from "../../config/gemini";

export const getExplanation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { question } = req.query as Record<string, string>;

    if (!question) {
      throw new Error("this field shoudl use");
    }

    const prompt = conceptExplainPrompt(question);

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
