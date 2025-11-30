import { Request, Response } from "express";
import { ai } from "../../config/gemini";
import { ObjectId } from "mongodb";
import { interviewFeedbackPrompt } from "../../utils/prompt/prompt";
import { SessionModel } from "../../model/session-model";

export const generateInterviewFeedback = async (
  req: Request,
  res: Response
) => {
  try {
    const { sessionId } = req.params;

    if (!req?.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!sessionId) {
      res.status(400).json({ message: "sessionId is required" });
      return;
    }

    // Load conversation
    const session = await SessionModel.findOne({
      _id: new ObjectId(sessionId),
    });

    console.log(
      "this is conversation >>>>>>>>>>>>>>>>>>>>>>>>>>>",
      session,
      sessionId
    );

    if (
      !session ||
      !session.conversation ||
      session.conversation.length === 0
    ) {
      res.status(400).json({
        message: "No conversation content available",
      });
      return;
    }

    // Convert messages to readable script
    const formattedConversation = JSON.parse(session.conversation)
      .map((m: any) => `${m.sender}: ${m.text}`)
      .join("\n");

    const prompt = interviewFeedbackPrompt(formattedConversation);

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: prompt,
    });

    const rawText = response.text;

    if (!rawText) {
      res.status(500).json({ message: "AI returned empty response" });
      return;
    }

    const cleanedText = rawText
      .replace(/^```json/, "")
      .replace(/```$/, "")
      .trim();

    let json;

    try {
      json = JSON.parse(cleanedText);
    } catch (err) {
      console.error("JSON parse error:", err);
      res.status(500).json({
        message: "AI returned invalid feedback JSON",
        rawText,
      });
      return;
    }

    res.status(200).json(json);
    return;
  } catch (error: any) {
    console.error("Feedback generation error:", error);
    res.status(500).json({ message: error.message });
    return;
  }
};
