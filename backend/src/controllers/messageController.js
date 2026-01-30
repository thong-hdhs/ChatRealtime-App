import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import {
    emitNewMessage,
    updateConversationAfterCreateMessage,
} from "../utils/messageHelper.js";
import { io } from "../socket/index.js";
import { uploadImageFromBuffer } from "../middlewares/uploadMiddleware.js";

export const sendDirectMessage = async (req, res) => {
    try {
        const { recipientId, content, conversationId, imgUrl } = req.body;
        const senderId = req.user._id;

        let conversation;

        if (!content && !imgUrl) {
            return res.status(400).json({ message: "Thiếu nội dung" });
        }

        if (conversationId) {
            conversation = await Conversation.findById(conversationId);
        }

        if (!conversation) {
            conversation = await Conversation.create({
                type: "direct",
                participants: [
                    { userId: senderId, joinedAt: new Date() },
                    { userId: recipientId, joinedAt: new Date() },
                ],
                lastMessageAt: new Date(),
                unreadCounts: new Map(),
            });
        }

        const message = await Message.create({
            conversationId: conversation._id,
            senderId,
            content,
            imgUrl: imgUrl || undefined,
        });

        updateConversationAfterCreateMessage(conversation, message, senderId);

        // Get sender info for display
        const sender = await User.findById(senderId).select(
            "displayName avatarUrl",
        );
        conversation.lastMessage.senderDisplayName = sender?.displayName;
        conversation.lastMessage.senderAvatarUrl = sender?.avatarUrl;

        await conversation.save();

        emitNewMessage(io, conversation, message);

        return res.status(201).json({ message });
    } catch (error) {
        console.error("Lỗi xảy ra khi gửi tin nhắn trực tiếp", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

export const sendGroupMessage = async (req, res) => {
    try {
        const { conversationId, content, imgUrl } = req.body;
        const senderId = req.user._id;
        const conversation = req.conversation;

        if (!content && !imgUrl) {
            return res.status(400).json("Thiếu nội dung");
        }

        const message = await Message.create({
            conversationId,
            senderId,
            content,
            imgUrl: imgUrl || undefined,
        });

        updateConversationAfterCreateMessage(conversation, message, senderId);

        // Get sender info for display
        const sender = await User.findById(senderId).select(
            "displayName avatarUrl",
        );
        conversation.lastMessage.senderDisplayName = sender?.displayName;
        conversation.lastMessage.senderAvatarUrl = sender?.avatarUrl;

        await conversation.save();
        emitNewMessage(io, conversation, message);

        return res.status(201).json({ message });
    } catch (error) {
        console.error("Lỗi xảy ra khi gửi tin nhắn nhóm", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

export const uploadMessageFile = async (req, res) => {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ message: "No file uploaded" });

        // upload with resource_type auto so images, audio, video, etc. are supported
        const result = await uploadImageFromBuffer(
            file.buffer,
            { resource_type: "auto", originalName: file.originalname },
            req,
        );

        if (!result || !result.secure_url) {
            return res.status(500).json({ message: "Upload failed" });
        }

        return res.status(200).json({ url: result.secure_url, raw: result });
    } catch (error) {
        console.error(
            "Lỗi khi upload message file",
            error && error.stack ? error.stack : error,
        );
        return res.status(500).json({
            message: "Upload failed",
            error: error?.message ?? String(error),
        });
    }
};
