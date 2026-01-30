import { uploadImageFromBuffer } from "../middlewares/uploadMiddleware.js";
import User from "../models/User.js";
import { broadcastUserProfileUpdate } from "../socket/index.js";

export const authMe = async (req, res) => {
    try {
        const user = req.user; // lấy từ authMiddleware

        return res.status(200).json({
            user,
        });
    } catch (error) {
        console.error("Lỗi khi gọi authMe", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

export const searchUserByUsername = async (req, res) => {
    try {
        const { username } = req.query;

        if (!username || username.trim() === "") {
            return res
                .status(400)
                .json({ message: "Cần cung cấp username trong query." });
        }

        const user = await User.findOne({ username }).select(
            "_id displayName username avatarUrl",
        );

        return res.status(200).json({ user });
    } catch (error) {
        console.error("Lỗi xảy ra khi searchUserByUsername", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

export const uploadAvatar = async (req, res) => {
    try {
        const file = req.file;
        const userId = req.user._id;

        if (!file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const result = await uploadImageFromBuffer(
            file.buffer,
            { resource_type: "image", originalName: file.originalname },
            req,
        );

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                avatarUrl: result.secure_url,
                avatarId: result.public_id,
            },
            {
                new: true,
            },
        ).select("avatarUrl");

        if (!updatedUser.avatarUrl) {
            return res.status(400).json({ message: "Avatar trả về null" });
        }

        // Broadcast avatar update
        broadcastUserProfileUpdate({
            userId: updatedUser._id,
            avatarUrl: updatedUser.avatarUrl,
        });

        return res.status(200).json({ avatarUrl: updatedUser.avatarUrl });
    } catch (error) {
        console.error(
            "Lỗi xảy ra khi upload avatar",
            error && error.stack ? error.stack : error,
        );
        // Return error message to help debugging (remove or sanitize in production)
        return res.status(500).json({
            message: "Upload failed",
            error: error?.message ?? String(error),
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { displayName, phone, bio } = req.body;

        // Validate input
        if (displayName && displayName.trim().length === 0) {
            return res
                .status(400)
                .json({ message: "Tên hiển thị không được để trống" });
        }

        if (bio && bio.length > 500) {
            return res
                .status(400)
                .json({ message: "Giới thiệu không được vượt quá 500 ký tự" });
        }

        // Build update object
        const updateData = {};
        if (displayName) updateData.displayName = displayName.trim();
        if (phone !== undefined) updateData.phone = phone?.trim() || null;
        if (bio !== undefined) updateData.bio = bio?.trim() || null;

        const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
            new: true,
            runValidators: true,
        }).select("-hashedPassword");

        // Broadcast user profile update để các client khác biết
        console.log("Broadcasting user-profile-updated:", {
            userId: updatedUser._id,
            displayName: updatedUser.displayName,
        });

        broadcastUserProfileUpdate({
            userId: updatedUser._id,
            displayName: updatedUser.displayName,
            avatarUrl: updatedUser.avatarUrl,
            bio: updatedUser.bio,
            phone: updatedUser.phone,
        });

        return res.status(200).json({
            message: "Cập nhật hồ sơ thành công",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Lỗi xảy ra khi cập nhật hồ sơ", error);
        if (error.kind === "ObjectId") {
            return res
                .status(404)
                .json({ message: "Người dùng không tồn tại" });
        }
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};
