import { Request, Response, NextFunction } from "express";

export const logoutUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    
    res.clearCookie("jwtToken", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    res.status(200).json({
      success: true,
      message: "User logged out successfully!",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Logout failed." });
  }
};
