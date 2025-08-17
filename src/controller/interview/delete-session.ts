import { Request, Response } from "express";
import { SessionModel } from "../../model/session-model";
import { ObjectId } from "mongodb";

export const deleteSession  = async (
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

    await SessionModel.deleteOne({ _id: new ObjectId(sessionId) });

    res.status(200).json({
      data: sessionId,
      success: true,
      message: "Sessions deleted successfully",
    });
  } catch (error) {
    throw error;
  }
};
