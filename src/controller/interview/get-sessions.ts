import { Request, Response } from "express";
import { ISession, SessionModel } from "../../model/session-model";

export const getSession = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req?.user) {
      throw new Error("User is Unauthorized, please login and try");
    }

    console.log("Fetching sessions for user:", req.user._id);
    

    const sessions = await SessionModel.find<ISession[]>({
      userId: req?.user?._id,
    });

    if (!sessions) {
      throw new Error("session not fount with this id ");
    }
    res.status(200).json({
      data: sessions,
      success: true,
      message: "Sessions fetched successfully",
    });
  } catch (error) {
    throw error;
  }
};
