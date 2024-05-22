import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

const app = express();

app.use(
  cors({
    origin: `${process.env.CORS_ORIGIN}`,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

const __dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running");
  });
}
import userRouter from "./routes/user.routes.js";
import groupRouter from "./routes/group.routes.js";
import messageRouter from "./routes/message.routes.js";
import helpRouter from "./routes/help.routes.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/groups", groupRouter);
app.use("/api/v1/messages", messageRouter);
app.use("/api/v1/helps", helpRouter);

export { app };
