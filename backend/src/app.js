import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./utils/error.midleware.js";
const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://192.168.100.13:5173",
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// routes
import userRouter from "./routes/user.route.js";

app.use("/api/v1/users", userRouter);
app.use(errorHandler);
export default app;