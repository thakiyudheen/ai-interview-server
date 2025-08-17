import { Request, Response } from "express";
import { SessionModel } from "../../model/session-model";

export const createSession = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { role, experience, topicsToFocus, noOfQuestions } =
      req.body as Record<string, string>;

    if (!req?.user) {
      throw new Error("User is Unauthorized, please login and try");
    }

    console.log(req.body);
    

    if (!role || !experience || !topicsToFocus || !noOfQuestions) {
      throw new Error("this field shoudl use");
    }

    const session = await SessionModel.create({
      userId: req.user?._id,
      role,
      experience,
      topicsToFocus,
      noOfQuestions: Number(noOfQuestions),
    });

    res
      .status(202)
      .json({
        message: "Session created succsussfully",
        data: session,
        succuss: true,
      });
  } catch (error) {
    throw error;
  }
};
