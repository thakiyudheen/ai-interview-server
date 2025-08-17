import { Request, Response, NextFunction } from "express";
import { comparePassword, jwtToken } from "../../utils/auth/auth.utils";
import { UserModel } from "../../model/user-model";

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new Error("Invalid email or password.");
    }
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid email or password.");
    }

    const token = jwtToken({ _id: user._id?.toString(), email: user.email });

    res.cookie("jwtToken", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    res.status(200).json({
      success: true,
      data: user,
      message: "User logged in successfully!",
    });

    return;
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};
