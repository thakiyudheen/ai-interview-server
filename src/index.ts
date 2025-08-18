import {config} from "dotenv";
config();
import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { connectToDB } from "./config/db-connect";
import morgan from "morgan";
import interviewRouter from "./router/interview-route";
import authRouter from "./router/auth-route";
import cookieParser from "cookie-parser";

const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: process.env.FRONTEND,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const io = new Server(server, {
  cors: corsOptions,
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("message", (data) => {
    console.log("Message:", data);
    socket.broadcast.emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

connectToDB();

app.get("/working", (req, res) => {
  res.json({ message: "API working fine , you can move to further steps" });
});

app.get("/", (_req, res) => {
  res.send("Socket server is running");
});

app.use("/api/auth", authRouter);
app.use("/api/ai", interviewRouter);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
