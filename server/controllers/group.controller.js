import { Chat } from "../models/chat.model.js";
import { Group } from "../models/group.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createGroup = asyncHandler(async (req, res, next) => {
  try {
    const { name } = req.body;
    const isExist = await Group.findOne({ name: name });
    if (isExist) {
      return res.json({ message: "Can't create groups with same names" });
    }
    const group = await Group.create({
      name,
    });
    const user = await User.findById(req.user?._id);
    const createdGroup = await Group.findById(group._id);
    if (!createdGroup) {
      return res.json({ message: "Error creating Group" });
    }
    createdGroup.admin.push(req.user?._id);
    createdGroup.members.push(req.user?._id);
    user.Group_ids.push(group._id);
    await createdGroup.save();
    await user.save({ validateBeforeSave: false });
    const newGroup = await Group.findOne({ name: name, admin: req.user?._id })
      .populate({ path: "admin", select: "username avatar about" })
      .populate({ path: "members", select: "username avatar about" });
    return res
      .status(200)
      .json(new ApiResponse(200, newGroup, "Group Created successfully"));
  } catch (error) {
    throw new ApiError(500, "Error creating Group");
  }
});

const getGroup = asyncHandler(async (req, res, next) => {
  try {
    const { name } = req.body;
    const group = await Group.findOne({ name: name, members: req.user?._id })
      .populate({ path: "admin", select: "username avatar about" })
      .populate({ path: "members", select: "username avatar about" })
    if (!group) {
      return res.json({ message: "Group Doesn't exist" });
    }
    return res
      .status(200)
      .json(new ApiResponse(200, group, "Successfully fetched group"));
  } catch (error) {
    throw new ApiError(500, "Error while fetching group details");
  }
});

const toggleMember = asyncHandler(async (req, res, next) => {
  try {
    const { userId, group } = req.body;
    const user = await User.findById(userId);
    const groupName = await Group.findOne({
      name: group,
      admin: req.user._id,
    });
    if (!groupName) {
      return res.json({ message: "Can't toggle member" });
    }
    const isMember = user.Group_ids.includes(groupName._id);
    const isAdmin = groupName.admin.includes(userId);
    if (!isMember) {
      groupName.members.push(userId);
      user.Group_ids.push(groupName._id);
    } else {
      const index = groupName.members.indexOf(userId);
      if (index !== -1) {
        groupName.members.splice(index, 1);
      }
      const userIndex = user.Group_ids.indexOf(groupName._id);
      if (userIndex !== -1) {
        user.Group_ids.splice(userIndex, 1);
      }
      if (isAdmin) {
        const adminIndex = groupName.admin.indexOf(userId);
        if (adminIndex !== -1) {
          groupName.admin.splice(adminIndex, 1);
        }
      }
    }
    await Promise.all([
      groupName.save(),
      user.save({ validateBeforeSave: false }),
    ]);
    const editedGroup = await Group.findById(groupName._id)
      .populate("admin", "username")
      .populate("members", "username");
    return res
      .status(200)
      .json(new ApiResponse(200, editedGroup, "Successfully toggled member"));
  } catch (error) {
    throw new ApiError(500, "Error toggling member");
  }
});

const toggleAdmin = asyncHandler(async (req, res, next) => {
  try {
    const { userId, group } = req.body;
    const groupName = await Group.findOne({
      name: group,
      admin: req.user._id,
    });
    if (!groupName) {
      return res.json({ message: "Can't toggle admin" });
    }
    const isAdmin = groupName.admin.includes(userId);
    if (!isAdmin) {
      groupName.admin.push(userId);
    } else {
      groupName.admin.pull(userId);
    }
    await groupName.save();
    const editedGroup = await Group.findById(groupName._id)
      .populate("admin", "username")
      .populate("members", "username");
    return res
      .status(200)
      .json(new ApiResponse(200, editedGroup, "Successfully toggled admin"));
  } catch (error) {
    throw new ApiError(500, "Error toggling Admin");
  }
});

const leaveGroup = asyncHandler(async (req, res, next) => {
  try {
    const { group } = req.body;
    const userId = req.user?._id;
    const user = await User.findById(userId);
    const groupName = await Group.findOne({
      name: group,
      members: req.user._id,
    });
    if (!groupName) {
      return res.status(404).json({ message: "Group not found" });
    }
    const isMember = user.Group_ids.includes(groupName._id);
    if (!isMember) {
      return res
        .status(400)
        .json({ message: "You are not a member of this group" });
    }
    const isAdmin = groupName.admin.includes(user._id);
    if (isAdmin) {
      const adminIndex = groupName.admin.indexOf(user._id);
      if (adminIndex !== -1) {
        groupName.admin.splice(adminIndex, 1);
      }
    }
    const memberIndex = groupName.members.indexOf(userId);
    if (memberIndex !== -1) {
      groupName.members.splice(memberIndex, 1);
    }
    const groupIndex = user.Group_ids.indexOf(groupName._id);
    if (groupIndex !== -1) {
      user.Group_ids.splice(groupIndex, 1);
    }
    await Promise.all([
      groupName.save(),
      user.save({ validateBeforeSave: false }),
    ]);
    const editedGroup = await Group.findById(groupName._id)
      .populate("admin", "username")
      .populate("members", "username");
    return res
      .status(200)
      .json(new ApiResponse(200, editedGroup, "Successfully toggled admin"));
  } catch (error) {
    throw new ApiError(500, "Error leaving group");
  }
});

const changeAbout = asyncHandler(async (req, res, next) => {
  try {
    const { about, group } = req.body;
    const groupName = await Group.findOne({
      name: group,
      admin: req.user?._id,
    });
    if (!groupName) {
      console.log(group);
      console.log(req.user?._id);
      return res.json({ message: "Can't change about" });
    }
    groupName.about = about;
    await groupName.save();
    const editedGroup = await Group.findById(groupName._id)
      .populate("admin", "username")
      .populate("members", "username");
    return res
      .status(200)
      .json(new ApiResponse(500, editedGroup, "Successfully changed about"));
  } catch (error) {
    throw new ApiError(500, "Error while changing About");
  }
});

const deleteGroup = asyncHandler(async (req, res, next) => {
  try {
    const { name } = req.body;
    const group = await Group.findOne({ name: name, admin: req.user?._id });
    if (!group) {
      return res.json({ message: "You are not an admin" });
    }
    await Chat.deleteMany({ groupId: group._id });
    for (const memberId of group.members) {
      const member = await User.findById(memberId);
      if (member) {
        const memberIndex = member.Group_ids.indexOf(group._id);
        member.Group_ids.splice(memberIndex, 1);
        await member.save({ validateBeforeSave: false });
      }
    }
    await Group.deleteOne({
      name: name,
      admin: req.user?._id,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, "Group Deleted Successfully"));
  } catch (error) {
    throw new ApiError(500, "Error while deleting Group");
  }
});

export {
  createGroup,
  getGroup,
  toggleMember,
  toggleAdmin,
  changeAbout,
  deleteGroup,
  leaveGroup,
};
