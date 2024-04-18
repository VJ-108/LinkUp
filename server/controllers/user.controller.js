import { Group } from "../models/group.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const formatLastSeen = (lastSeen) => {
  const lastSeenDate = new Date(lastSeen);
  const now = new Date();
  const diffMilliseconds = now - lastSeenDate;
  const diffSeconds = Math.floor(diffMilliseconds / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffMonths > 0) {
    if (diffMonths === 1 && diffDays <= 30) {
      return "1 month ago";
    } else if (diffMonths < 6) {
      return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
    } else {
      return "Long time ago";
    }
  } else if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  } else if (diffMinutes > 0) {
    return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
  } else {
    return "Just Now";
  }
};

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
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) {
      throw new ApiError(401, "Invalid old password");
    }
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Password changed successfully"));
  } catch (error) {
    throw new ApiError(500, "Error while changing current password");
  }
});

const changeAbout = asyncHandler(async (req, res, next) => {
  try {
    const { about } = req.body;
    const user = await User.findById(req.user?._id);
    user.about = about;
    await user.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "About changed successfully"));
  } catch (error) {
    throw new ApiError(500, "Error while changing about");
  }
});

const getLastseen = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.user?._id);
    const lastSeen = user.lastSeen;
    const formattedLastSeen = formatLastSeen(lastSeen);
    return res.json(new ApiResponse(200, `Last seen ${formattedLastSeen}`));
  } catch (error) {
    throw new ApiError(500, "Error while fetching lastseen");
  }
});

const updateLastseen = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { lastSeen: new Date() },
      { new: true }
    );
    const lastSeen = user.lastSeen;
    const formattedLastSeen = formatLastSeen(lastSeen);
    return res.json(new ApiResponse(200, `Last seen ${formattedLastSeen}`));
  } catch (error) {
    throw new ApiError(500, "Error while updating lastseen");
  }
});

const toggleChat_Bot = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { Chat_Bot: !req.user.Chat_Bot },
      { new: true }
    );
    return res.json(new ApiResponse(200, "Chat_bot toggled successfully"));
  } catch (error) {
    throw new ApiError(500, "Error while toggling chat_bot");
  }
});

const toggleChat_type = asyncHandler(async (req, res, next) => {
  try {
    const newChatType =
      req.user.chat_type === "temporary" ? "permanent" : "temporary";
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { chat_type: newChatType },
      { new: true }
    );
    return res.json(new ApiResponse(200, "Chat_type toggled successfully"));
  } catch (error) {
    throw new ApiError(500, "Error while toggling chat_type");
  }
});

const toggleBlocked_id = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { blocked_id } = req.body;
    const blockedUser = await User.findById(blocked_id);
    if (!blockedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const index = user.Blocked_ids.indexOf(blocked_id);
    if (index === -1) {
      user.Blocked_ids.push(blocked_id);
    } else {
      user.Blocked_ids.splice(index, 1);
    }
    await user.save({ validateBeforeSave: false });
    return res.json(
      new ApiResponse(
        200,
        { Blocked_ids: user.Blocked_ids },
        "Blocked user toggled successfully"
      )
    );
  } catch (error) {
    throw new ApiError(500, "Error while toggling blocked_id");
  }
});

const getBlocked_ids = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.user?._id).populate({
      path: "Blocked_ids",
      select: "_id username",
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(new ApiResponse(200, { blocked_id: user.Blocked_ids }));
  } catch (error) {
    throw new ApiError(500, "Error while fetching blocked_id");
  }
});

const toggleContact_id = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { contact_id } = req.body;
    const ContactUser = await User.findById(contact_id);
    if (!ContactUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const index = user.Contact_ids.indexOf(contact_id);
    if (index === -1) {
      user.Contact_ids.push(contact_id);
    } else {
      user.Contact_ids.splice(index, 1);
    }
    await user.save({ validateBeforeSave: false });
    return res.json(
      new ApiResponse(
        200,
        { Contact_ids: user.Contact_ids },
        "Contact user toggled successfully"
      )
    );
  } catch (error) {
    throw new ApiError(500, "Error while toggling contact_id");
  }
});

const getContact_ids = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.user?._id).populate({
      path: "Contact_ids",
      select: "_id username",
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(new ApiResponse(200, { contact_id: user.Contact_ids }));
  } catch (error) {
    throw new ApiError(500, "Error while fetching contact_id");
  }
});

const getUserId = asyncHandler(async (req, res, next) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(new ApiResponse(200, { userId: user._id }));
  } catch (error) {
    throw new ApiError(500, "Error while fetching userId");
  }
});

const changeUsername = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.user?._id);
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
      .json(new ApiResponse(200, {}, "Username changed successfully"));
  } catch (error) {
    throw new ApiError(500, "Error while changing username");
  }
});

const getUsername = asyncHandler(async (req, res, next) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(new ApiResponse(200, { username: user.username }));
  } catch (error) {
    throw new ApiError(500, "Error while fetching username");
  }
});

// const toggleGroup_id = asyncHandler(async (req, res, next) => {
//   try {
//     const user = await User.findById(req.user?._id);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     const { group_id } = req.body;
//     const Group = await User.findById(group_id);
//     if (!Group) {
//       return res.status(404).json({ message: "Group not found" });
//     }
//     const index = user.Group_ids.indexOf(group_id);
//     if (index === -1) {
//       user.Group_ids.push(group_id);
//     } else {
//       user.Group_ids.splice(index, 1);
//     }
//     await user.save({ validateBeforeSave: false });
//     return res.json(
//       new ApiResponse(
//         200,
//         { Group_ids: user.Group_ids },
//         "Group toggled successfully"
//       )
//     );
//   } catch (error) {
//     throw new ApiError(500, "Error while toggling group");
//   }
// });

// const getGroup_ids = asyncHandler(async (req, res, next) => {
//   try {
//     const user = await User.findById(req.user?._id);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     return res.json(new ApiResponse(200, { groups: user.Group_ids }));
//   } catch (error) {
//     throw new ApiError(500, "Error while fetching groups");
//   }
// });

const toggleArchived = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.body;
    const chat = await User.findById(id);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    const user = await User.findById(req.user?._id);
    const index = user.Archived.indexOf(id);
    if (index === -1) {
      user.Archived.push(id);
    } else {
      user.Archived.splice(index, 1);
    }
    await user.save({ validateBeforeSave: false });
    return res
      .status(200)
      .json({ message: "Chat archived state toggled successfully" });
  } catch (error) {
    throw new ApiError(500, "Error while toggling archived chats");
  }
});

const getArchived = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.user?._id).populate({
      path: "Archived",
      select: "_id username",
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(new ApiResponse(200, { Archived: user.Archived }));
  } catch (error) {
    throw new ApiError(500, "Error while fetching archived items");
  }
});

const deleteAccount = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.deleteOne({ _id: req.user?._id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Account deleted successfully"));
  } catch (error) {
    throw new ApiError(500, "Error while deleting account");
  }
});

export {
  registerUser,
  loginUser,
  logOutUser,
  refreshAccessToken,
  changeCurrentPassword,
  changeAbout,
  getLastseen,
  updateLastseen,
  toggleChat_Bot,
  toggleChat_type,
  toggleBlocked_id,
  getBlocked_ids,
  toggleContact_id,
  getContact_ids,
  getUserId,
  changeUsername,
  getUsername,
  deleteAccount,
  toggleArchived,
  getArchived,
};
