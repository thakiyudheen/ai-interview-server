import { Request, Response } from "express";
import { ai } from "../../config/gemini";
import { scrapePortfolioAndResume } from "../../utils/scrap/scrap-portfolio";

export async function getPortfolioAnswer(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const question = req.query.question as string;

    if (!question) {
      res.status(400).json({ error: "Missing 'question' query parameter" });
    }
    const portfolioText = await scrapePortfolioAndResume();
    const prompt = `You are a chatbot that ONLY answers based on the portfolio text below .If the portfolio does not contain the answer, reply:"I don't have that information in the portfolio."
Portfolio:
${portfolioText}

Question:
${question}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: prompt,
    });

    const rawText = response.text;
    const cleanedText = rawText
      ?.replace(/^```json/, "")
      .replace(/```$/, "")
      .trim();

    res.json({ answer: cleanedText || "No answer found" });
    return;
  } catch (error: any) {
    console.error("Error answering question:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
