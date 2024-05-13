import { Group } from "../models/group.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const generateAccessandRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return {
      accessToken,
      refreshToken,
    };
  } catch (err) {
    throw new ApiError(500, "Error while generating access and refresh Token");
  }
};

const registerUser = asyncHandler(async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if ([username, email, password].some((field) => field?.trim() === "")) {
      throw new ApiError(400, "All fields are required");
    }
    if (username.length > 20) {
      throw new ApiError(400, "Username must be less than 20 characters");
    }
    const existedUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (existedUser) {
      throw new ApiError(409, "User already exists");
    }
    const user = await User.create({
      username,
      email,
      password,
    });
    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      throw new ApiError(400, "User creation failed");
    }

    return res
      .status(201)
      .json(new ApiResponse(200, createdUser, "User registered successfully"));
  } catch (error) {
    throw new ApiError(500, "Error while registering user");
  }
});

const loginUser = asyncHandler(async (req, res, next) => {
  try {
    const accessToken = req.cookies?.accessToken;
    if (!accessToken) {
      const { email, password } = req.body;
      if ([email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
      }
      const user = await User.findOne({ email });
      if (!user) {
        throw new ApiError(401, "User not found");
      }
      const isMatch = await user.isPasswordCorrect(password);
      if (!isMatch) {
        throw new ApiError(401, "Invalid credentials");
      }
      const { accessToken, refreshToken } = await generateAccessandRefreshToken(
        user._id
      );
      const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
      );
      const options = {
        httpOnly: true,
        secure: true,
      };
      return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
          new ApiResponse(
            200,
            { user: loggedInUser, accessToken, refreshToken },
            "User logged in successfully"
          )
        );
    } else {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      if (!decoded || !decoded._id) {
        throw new ApiError(401, "Invalid access token");
      }
      const user = await User.findById(decoded._id).select(
        "-password -refreshToken"
      );
      if (!user) {
        throw new ApiError(401, "User not found");
      }
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { user: user },
            "User logged in successfully using access token"
          )
        );
    }
  } catch (error) {
    throw new ApiError(500, "Error while logging in user");
  }
});

const logOutUser = asyncHandler(async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $unset: {
          refreshToken: 1,
        },
      },
      { new: true }
    );

    const options = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User logged out successfully"));
  } catch (error) {
    throw new ApiError(500, "Error while logging out user");
  }
});

const refreshAccessToken = asyncHandler(async (req, res, next) => {
  try {
    const oldrefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!oldrefreshToken) {
      throw new ApiError(401, "Unauthorized request");
    }
    const decodedToken = jwt.verify(
      oldrefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Unauthorized request");
    }

    if (oldrefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh Token is expired or used");
    }
    const options = {
      httpOnly: true,
      secure: true,
    };
    const { accessToken, refreshToken } = await generateAccessandRefreshToken(
      user._id
    );
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { user: user, accessToken, refreshToken: refreshToken },
          "User refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Refresh Token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user?._id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const isPasswordCorrect = user.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) {
      throw new ApiError(401, "Invalid old password");
    }
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    const editedUser = await User.findById(req.user?._id).select(
      "-password -refreshToken"
    );
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { user: editedUser },
          "Password changed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(500, "Error while changing current password");
  }
});

const changeAbout = asyncHandler(async (req, res, next) => {
  try {
    const { about } = req.body;
    const user = await User.findById(req.user?._id).select(
      "-password -refreshToken"
    );
    user.about = about;
    await user.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json(new ApiResponse(200, { user: user }, "About changed successfully"));
  } catch (error) {
    throw new ApiError(500, "Error while changing about");
  }
});

const toggleChat_Bot = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { Chat_Bot: !req.user.Chat_Bot },
      { new: true }
    ).select("-password -refreshToken");
    return res.json(
      new ApiResponse(200, { user: user }, "Chat_bot toggled successfully")
    );
  } catch (error) {
    throw new ApiError(500, "Error while toggling chat_bot");
  }
});

const changeUsername = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.user?._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { username } = req.body;
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ message: "Username already exists" });
    }
    user.username = username;
    await user.save({ validateBeforeSave: false });
    return res
      .status(200)
      .json(
        new ApiResponse(200, { user: user }, "Username changed successfully")
      );
  } catch (error) {
    throw new ApiError(500, "Error while changing username");
  }
});

const deleteAccount = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await Group.updateMany(
      { $or: [{ members: req.user?._id }, { admin: req.user?._id }] },
      { $pull: { members: req.user?._id, admin: req.user?._id } }
    );
    await user.deleteOne({ _id: req.user?._id });
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Account deleted successfully"));
  } catch (error) {
    console.error(error);
    throw new ApiError(500, "Error while deleting account");
  }
});

const changeAvatar = asyncHandler(async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const user = await User.findById(req.user?._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.avatar = avatar;
    await user.save({ validateBeforeSave: false });
    return res
      .status(200)
      .json(
        new ApiResponse(200, { user: user }, "Successfully changed avatar")
      );
  } catch (error) {
    throw new ApiError(500, "Error while changing Avatar");
  }
});

const searchUser = asyncHandler(async (req, res, next) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res
        .status(400)
        .json({ message: "Username is required to search user" });
    }
    const user = await User.find({
      username: { $regex: username, $options: "i" },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const users = user.map((user) => ({
      _id: user._id,
      username: user.username,
      avatar: user.avatar,
      about: user.about,
    }));
    return res
      .status(200)
      .json(new ApiResponse(200, users, "Successfully fetched user"));
  } catch (error) {
    throw new ApiError(500, "Error while searching user");
  }
});

export {
  registerUser,
  loginUser,
  logOutUser,
  refreshAccessToken,
  changeCurrentPassword,
  changeAbout,
  toggleChat_Bot,
  changeUsername,
  deleteAccount,
  changeAvatar,
  searchUser,
};
