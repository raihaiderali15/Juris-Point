import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./utils/error.midleware.js";
const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// routes
import userRouter from "./routes/user.route.js";

app.use("/api/v1/users", userRouter);
app.use(errorHandler);
export default app;