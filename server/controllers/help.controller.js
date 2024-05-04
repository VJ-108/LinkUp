import { Help } from "../models/help.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const sendHelp = asyncHandler(async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    const newHelp = new Help({
      name,
      email,
      message,
    });
    await newHelp.save();
    return res
      .status(200)
      .json(new ApiResponse(200, newHelp, "Help sent successfully"));
  } catch (error) {
    throw new ApiError(500, "Error while sending help");
  }
});

export { sendHelp };
