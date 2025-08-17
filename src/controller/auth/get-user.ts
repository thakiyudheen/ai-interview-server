import { Request, Response, NextFunction } from "express";
import { UserModel } from "../../model/user-model";

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req?.user ;
    if (!user) {
      throw new Error("user Unauthourised , Please login and try again.");
    }
    const userData = await UserModel.findOne({email:req.user?.email})

    res.status(200).json({
      success: true,
      data: userData,
      message: "User fetched successfully!",
    });

    return;
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};
