import { Request, Response, NextFunction } from "express";
import {
  hashPassword,
  isUserExist,
  jwtToken,
} from "../../utils/auth/auth.utils";
import { UserModel } from "../../model/user-model";

export const signupUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (await isUserExist({ email })) {
      res
        .status(400)
        .json({ success: false, message: "Email already exists!" });
    }

    req.body.password = await hashPassword(password);
    const user = await UserModel.create({ ...req.body });

    const token = jwtToken({ _id: user?._id.toString(), email: user.email });

    res.cookie("jwtToken", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    res.status(201).json({
      success: true,
      data: user,
      message: "User signed up successfully!",
    });
  } catch (error) {
    next(error);
  }
};
