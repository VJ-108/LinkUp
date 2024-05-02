import { Group } from "../models/group.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

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
      const user = await User.findById(decoded._id);
      if (!user) {
        throw new ApiError(401, "User not found");
      }
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { user },
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
    const { blocked_user } = req.body;
    const blockedUser = await User.findOne({ username: blocked_user });
    if (!blockedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const blocked_id = blockedUser._id;
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
    const { contact_user } = req.body;
    const ContactUser = await User.findOne({ username: contact_user });
    if (!ContactUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const contact_id = ContactUser._id;
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
    // throw new ApiError(500, "Error while toggling contact_id");
    console.log(error);
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

const leaveGroup = asyncHandler(async (req, res, next) => {
  try {
    const { group } = req.body;
    const user = await User.findById(req.user?._id);
    const groupName = await Group.findOne({
      name: group,
      members: req.user?._id,
    });
    if (!groupName) {
      return res.json({ message: "Group Not Found" });
    }
    const groupIndex = user.Group_ids.indexOf(groupName._id);
    const userIndex = groupName.members.indexOf(user._id);
    const adminIndex = groupName.admin.indexOf(user._id);
    user.Group_ids.splice(groupIndex, 1);
    groupName.members.splice(userIndex, 1);
    if (adminIndex !== -1) groupName.admin.splice(adminIndex, 1);
    await user.save({ validateBeforeSave: false });
    await groupName.save();
    if (groupName.admin.length === 0)
      await Group.findByIdAndDelete(groupName._id);
    return res
      .status(200)
      .json(
        new ApiResponse(200, groupName.name, "Successfully left the group")
      );
  } catch (error) {
    throw new ApiError(500, "Error while leaving group");
  }
});

const getGroups = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.user?._id).populate("Group_ids");
    if (!user) {
      return res.json({ message: "No Group Found" });
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, user.Group_ids, "Successfully fetched Groups")
      );
  } catch (error) {
    throw new ApiError(500, "Error while fetching groups");
  }
});

const toggleArchived = asyncHandler(async (req, res, next) => {
  try {
    const { name } = req.body;
    const user = await User.findById(req.user?._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    let archiveArray;
    if (name) {
      const archivedUser = await User.findOne({ username: name });
      const archivedGroup = await Group.findOne({
        name: name,
        members: req.user?._id,
      });
      if (!archivedUser && !archivedGroup) {
        return res.status(404).json({ message: "User or Group not found" });
      }
      archiveArray = archivedUser ? user.Archived_User : user.Archived_Group;
      const index = archiveArray.indexOf(
        archivedUser ? archivedUser._id : archivedGroup._id
      );
      if (index === -1) {
        archiveArray.push(archivedUser ? archivedUser._id : archivedGroup._id);
      } else {
        archiveArray.splice(index, 1);
      }
    } else {
      return res
        .status(400)
        .json({ message: "Name of User or Group is required" });
    }
    await user.save({ validateBeforeSave: false });
    return res
      .status(200)
      .json(new ApiResponse(200, "Successfully toggled archived chats"));
  } catch (error) {
    throw new ApiError(500, "Error while toggling archived items");
  }
});

const getArchived = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.user?._id)
      .populate({
        path: "Archived_User",
        select: "_id username",
      })
      .populate("Archived_Group");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const archived = {
      Archived_User: user.Archived_User,
      Archived_Group: user.Archived_Group,
    };
    return res.json(
      new ApiResponse(200, archived, "Successfully fetched archived chats")
    );
  } catch (error) {
    throw new ApiError(500, "Error while fetching archived items");
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
    const user = await User.findById(req.user?._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.avatar = avatar;
    await user.save({ validateBeforeSave: false });
    return res
      .status(200)
      .json(new ApiResponse(200, user.avatar, "Successfully changed avatar"));
  } catch (error) {
    throw new ApiError(500, "Error while changing Avatar");
  }
});

const removeAvatar = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.user?._id);
    user.avatar = "";
    await user.save({ validateBeforeSave: false });
    return res
      .status(200)
      .json(new ApiResponse(200, user.avatar, "Successfully removed avatar"));
  } catch (error) {
    throw new ApiError(500, "Error while removing Avatar");
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
  leaveGroup,
  getGroups,
  changeAvatar,
  removeAvatar,
  searchUser,
};
