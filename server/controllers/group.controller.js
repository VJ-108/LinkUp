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
    return res
      .status(200)
      .json(new ApiResponse(200, createdGroup, "Group Created successfully"));
  } catch (error) {
    throw new ApiError(500, "Error creating Group");
  }
});

const getGroup = asyncHandler(async (req, res, next) => {
  try {
    const { name } = req.body;
    const group = await Group.findOne({ name: name, members: req.user?._id });
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
      admin: req.user?._id,
    });
    if (!groupName) {
      return res.json({ message: "Can't toggle member" });
    }
    const groupIndex = user.Group_ids.indexOf(groupName._id);
    const index = groupName.members.indexOf(userId);
    if (index === -1) {
      groupName.members.push(userId);
      user.Group_ids.push(groupName._id);
    } else {
      groupName.members.splice(index, 1);
      user.Group_ids.splice(groupIndex, 1);
    }
    await groupName.save();
    await user.save({ validateBeforeSave: false });
    return res
      .status(200)
      .json(
        new ApiResponse(200, groupName.members, "Successfully toggled member")
      );
  } catch (error) {
    throw new ApiError(500, "Error toggling member");
  }
});

const toggleAdmin = asyncHandler(async (req, res, next) => {
  try {
    const { userId, group } = req.body;
    const isMember = await Group.findOne({
      name: group,
      members: userId,
    });
    const groupName = await Group.findOne({
      name: group,
      admin: req.user?._id,
    });
    if (!groupName) {
      return res.json({ message: "Can't toggle admin" });
    }
    if (!isMember) {
      return res.json({ message: "Can't toggle admin" });
    }
    const index = groupName.admin.indexOf(userId);
    if (index === -1) {
      groupName.admin.push(userId);
    } else {
      groupName.admin.splice(index, 1);
    }
    await groupName.save();
    return res
      .status(200)
      .json(
        new ApiResponse(200, groupName.admin, "Successfully toggled admin")
      );
  } catch (error) {
    throw new ApiError(500, "Error toggling Admin");
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
      return res.json({ message: "Can't change about" });
    }
    groupName.about = about;
    await groupName.save();
    return res
      .status(200)
      .json(
        new ApiResponse(500, groupName.about, "Successfully changed about")
      );
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
    await Group.deleteOne({
      name: name,
      admin: req.user?._id,
    });
    for (const memberId of group.members) {
      const member = await User.findById(memberId);
      if (member) {
        const memberIndex = member.Group_ids.indexOf(group._id);
        member.Group_ids.splice(memberIndex, 1);
        await member.save({ validateBeforeSave: false });
      }
    }
    return res
      .status(200)
      .json(new ApiResponse(200, "Group Deleted Successfully"));
  } catch (error) {
    throw new ApiError(500, "Error while deleting Group");
  }
});

const changeAvatar = asyncHandler(async (req, res, next) => {
  try {
    const { avatar, name } = req.body;
    const group = await Group.findOne({
      name: name,
      admin: req.user?._id,
    });
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    group.avatar = avatar;
    await group.save();
    return res
      .status(200)
      .json(new ApiResponse(200, group.avatar, "Successfully changed avatar"));
  } catch (error) {
    throw new ApiError(500, "Error while changing Avatar");
  }
});

const removeAvatar = asyncHandler(async (req, res, next) => {
  try {
    const { name } = req.body;
    const group = await Group.findOne({
      name: name,
      admin: req.user?._id,
    });
    group.avatar = "";
    await group.save();
    return res
      .status(200)
      .json(new ApiResponse(200, group.avatar, "Successfully removed avatar"));
  } catch (error) {
    throw new ApiError(500, "Error while removing Avatar");
  }
});

export {
  createGroup,
  getGroup,
  toggleMember,
  toggleAdmin,
  changeAbout,
  deleteGroup,
  changeAvatar,
  removeAvatar,
};
