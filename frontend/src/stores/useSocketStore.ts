import { create } from "zustand";
import { io, type Socket } from "socket.io-client";
import { useAuthStore } from "./useAuthStore";
import type { SocketState } from "@/types/store";
import { useChatStore } from "./useChatStore";

const baseURL = import.meta.env.VITE_SOCKET_URL;

export const useSocketStore = create<SocketState>((set, get) => ({
    socket: null,
    onlineUsers: [],
    connectSocket: () => {
        const accessToken = useAuthStore.getState().accessToken;
        const existingSocket = get().socket;

        if (existingSocket) return; // tránh tạo nhiều socket

        const socket: Socket = io(baseURL, {
            auth: { token: accessToken },
            transports: ["websocket"],
        });

        set({ socket });

        socket.on("connect", () => {
            console.log("Đã kết nối với socket");
            setupEventListeners(socket);
        });

        socket.on("reconnect", () => {
            console.log("Reconnected to socket");
            setupEventListeners(socket);
        });

        // Setup listeners on initial connection
        setupEventListeners(socket);
    },
    disconnectSocket: () => {
        const socket = get().socket;
        if (socket) {
            socket.disconnect();
            set({ socket: null });
        }
    },
}));

const setupEventListeners = (socket: Socket) => {
    // Remove all existing listeners first to prevent duplicates
    socket.off("online-users");
    socket.off("new-message");
    socket.off("read-message");
    socket.off("new-group");
    socket.off("user-profile-updated");

    // online users
    socket.on("online-users", (userIds) => {
        console.log("Updated online users:", userIds);
        useSocketStore.setState({ onlineUsers: userIds });
    });

    // new message
    socket.on("new-message", ({ message, conversation, unreadCounts }) => {
        useChatStore.getState().addMessage(message);

        const lastMessage = {
            _id: conversation.lastMessage._id,
            content: conversation.lastMessage.content,
            createdAt: conversation.lastMessage.createdAt,
            sender: {
                _id: conversation.lastMessage.senderId,
                displayName: conversation.lastMessage.senderDisplayName || "",
                avatarUrl: conversation.lastMessage.senderAvatarUrl || null,
            },
        };

        const updatedConversation = {
            ...conversation,
            lastMessage,
            unreadCounts,
        };

        if (
            useChatStore.getState().activeConversationId ===
            message.conversationId
        ) {
            useChatStore.getState().markAsSeen();
        }

        useChatStore.getState().updateConversation(updatedConversation);
    });

    // read message
    socket.on("read-message", ({ conversation, lastMessage }) => {
        const updated = {
            _id: conversation._id,
            lastMessage,
            lastMessageAt: conversation.lastMessageAt,
            unreadCounts: conversation.unreadCounts,
            seenBy: conversation.seenBy,
        };

        useChatStore.getState().updateConversation(updated);
    });

    // new group chat
    socket.on("new-group", (conversation) => {
        useChatStore.getState().addConvo(conversation);
        socket.emit("join-conversation", conversation._id);
    });

    // user profile updated
    socket.on("user-profile-updated", (updatedUserData) => {
        console.log("🔔 Received user-profile-updated event:", updatedUserData);

        const currentUser = useAuthStore.getState().user;
        const chatStore = useChatStore.getState();

        // So sánh userId - convert về string để chắc chắn
        const userIdStr = updatedUserData.userId?.toString();
        const currentUserIdStr = currentUser?._id?.toString();

        // Nếu đó là user hiện tại, cập nhật auth store
        if (currentUser && userIdStr === currentUserIdStr) {
            console.log("✅ Updating current user profile");
            useAuthStore.getState().setUser({
                ...currentUser,
                ...(updatedUserData.displayName && {
                    displayName: updatedUserData.displayName,
                }),
                ...(updatedUserData.avatarUrl && {
                    avatarUrl: updatedUserData.avatarUrl,
                }),
                ...(updatedUserData.bio !== undefined && {
                    bio: updatedUserData.bio,
                }),
                ...(updatedUserData.phone !== undefined && {
                    phone: updatedUserData.phone,
                }),
            });
        }

        // Cập nhật tên hiển thị trong tất cả conversations
        console.log(
            "✅ Updating conversation user info for userId:",
            userIdStr,
        );
        chatStore.updateConversationUserInfo(
            updatedUserData.userId,
            updatedUserData.displayName,
            updatedUserData.avatarUrl,
        );
    });
};
