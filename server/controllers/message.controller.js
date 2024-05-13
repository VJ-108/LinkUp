import { Message } from "../models/message.model.js";
import { Chat } from "../models/chat.model.js";
import { User } from "../models/user.model.js";
import { Group } from "../models/group.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

const sendMessage = asyncHandler(async (req, res, next) => {
  try {
    const { message, receiverId, groupId } = req.body;
    const senderId = req.user?._id;
    let conversation;
    let newMessage;
    if (!groupId) {
      const receiver = await User.findById(receiverId);
      if (!receiver) {
        return res.json({ message: "Can't send message" });
      }
      conversation = await Chat.findOne({
        participants: { $all: [senderId, receiverId] },
      });
      if (!conversation) {
        conversation = await Chat.create({
          participants: [senderId, receiverId],
        });
      }
      newMessage = new Message({
        senderId,
        receiverId,
        message,
      });
    } else {
      const group = await Group.findById(groupId);
      if (!group) {
        return res.json({ message: "Group not found" });
      }
      conversation = await Chat.findOne({ groupId });
      if (!conversation) {
        conversation = await Chat.create({
          participants: group.members,
          groupId,
        });
      }
      newMessage = new Message({
        senderId,
        groupId,
        message,
      });
    }
    conversation.messages.push(newMessage._id);
    await conversation.save();
    await newMessage.save();

    //Socket Functionality
    const receiverSocketId = getReceiverSocketId(receiverId);
    const senderSocketId = getReceiverSocketId(senderId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    if (senderSocketId) {
      io.to(senderSocketId).emit("newMessage", newMessage);
    } else if (groupId) {
      io.to(groupId).emit("groupMessage", { groupId, message: newMessage });
    }
    return res
      .status(200)
      .json(new ApiResponse(200, newMessage, "Message sent successfully"));
  } catch (error) {
    throw new ApiError(500, "Error while sending message");
  }
});

const getMessage = asyncHandler(async (req, res, next) => {
  try {
    const { receiverId, groupId } = req.body;
    const senderId = req.user?._id;
    let conversation;
    if (!groupId) {
      conversation = await Chat.findOne({
        participants: { $all: [senderId, receiverId] },
      }).populate({
        path: "messages",
      });
    } else {
      conversation = await Chat.findOne({ groupId }).populate({
        path: "messages",
      });
    }
    if (!conversation) {
      return res.json({ data: [] });
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          conversation.messages,
          "Successfully fetched conversation"
        )
      );
  } catch (error) {
    throw new ApiError(500, "Error while fetching messages");
  }
});

const getUserChats = asyncHandler(async (req, res, next) => {
  try {
    const userChats = await Chat.find({ participants: req.user?._id })
      .select("participants groupId")
      .populate({
        path: "participants",
        select: "username avatar about",
      })
      .populate({
        path: "groupId",
        select: "name members about",
        populate: {
          path: "members",
          select: "username avatar about",
        },
      });
    return res
      .status(200)
      .json(new ApiResponse(200, userChats, "Successfully fetched Chats"));
  } catch (error) {
    throw new ApiError(500, "Error while fetching Chats");
  }
});
export { sendMessage, getMessage, getUserChats };
