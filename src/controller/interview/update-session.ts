import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { SessionModel } from "../../model/session-model";

export const updateSessionConversation = async (req: Request, res: Response) : Promise<void>=> {
  try {
    const { sessionId } = req.params;
    const { conversation } = req.body;

    if (!req?.user) {
       res.status(401).json({ message: "Unauthorized" });
       return
    }

    if (!sessionId) {
       res.status(400).json({ message: "sessionId is required" });
       return
    }

    if (!conversation) {
       res.status(400).json({ message: "conversation is required" });
       return
    }

    let conversationString = "";

    if (typeof conversation === "string") {
      conversationString = conversation;
    } else {
      conversationString = JSON.stringify(conversation);
    }

    const updated = await SessionModel.findOneAndUpdate(
      { _id: new ObjectId(sessionId) },
      { conversation: conversationString },
      { new: true }
    );

    if (!updated) {
      res.status(404).json({ message: "Session not found" });
      return
    }

     res.status(200).json({
      success: true,
      message: "Conversation updated successfully",
      session: updated,
    });

    return 
  } catch (error:any) {
    console.error("Update conversation error:", error);
     res.status(500).json({ message: error.message });
  }
};
