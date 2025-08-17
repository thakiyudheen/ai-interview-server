import { Router, Request, Response } from "express";
import { signupUser } from "../controller/auth/signup-user";
import { loginUser } from "../controller/auth/login-user";
import { authMiddleware } from "../middleware/authetication";
import { getUser } from "../controller/auth/get-user";
import { logoutUser } from "../controller/auth/logout";
const authRouter = Router();

authRouter.post("/signup", signupUser);

authRouter.get("/getUser", authMiddleware, getUser);

authRouter.post("/login", loginUser);

authRouter.post("/logout", logoutUser);

export default authRouter;
