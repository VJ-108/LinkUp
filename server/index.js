import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { server,io } from "./app.js";

dotenv.config({
  path: "./env",
});

connectDB()
  .then(() => {
    io.on("error", (err) => {
      console.log("ERROR: ", err);
      throw err;
    })
    server.on("error", (err) => {
      console.log("ERROR: ", err);
      throw err;
    });
    server.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port ${process.env.PORT || 8000}`);
    });
  })
  .catch((err) => {
    console.log("MONGODB CONNECTION FAILED: ", err);
  });
