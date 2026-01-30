import { cn, formatMessageTime } from "@/lib/utils";
import type { Conversation, Message, Participant } from "@/types/chat";
import UserAvatar from "./UserAvatar";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";

interface MessageItemProps {
    message: Message;
    index: number;
    messages: Message[];
    selectedConvo: Conversation;
    lastMessageStatus: "delivered" | "seen";
}

const MessageItem = ({
    message,
    index,
    messages,
    selectedConvo,
    lastMessageStatus,
}: MessageItemProps) => {
    const prev = index + 1 < messages.length ? messages[index + 1] : undefined;

    const isShowTime =
        index === 0 ||
        new Date(message.createdAt).getTime() -
            new Date(prev?.createdAt || 0).getTime() >
            300000; // 5 phút

    const isGroupBreak = isShowTime || message.senderId !== prev?.senderId;

    const participant = selectedConvo.participants.find(
        (p: Participant) => p._id.toString() === message.senderId.toString(),
    );

    return (
        <>
            {/* time */}
            {isShowTime && (
                <span className="flex justify-center text-xs text-muted-foreground px-1">
                    {formatMessageTime(new Date(message.createdAt))}
                </span>
            )}

            <div
                className={cn(
                    "flex gap-2 message-bounce mt-1",
                    message.isOwn ? "justify-end" : "justify-start",
                )}
            >
                {/* avatar */}
                {!message.isOwn && (
                    <div className="w-8">
                        {isGroupBreak && (
                            <UserAvatar
                                type="chat"
                                name={participant?.displayName ?? "Chat App"}
                                avatarUrl={participant?.avatarUrl ?? undefined}
                            />
                        )}
                    </div>
                )}

                {/* tin nhắn */}
                <div
                    className={cn(
                        "max-w-xs lg:max-w-md space-y-1 flex flex-col",
                        message.isOwn ? "items-end" : "items-start",
                    )}
                >
                    {/* Hiển thị tên người gửi trong group chat */}
                    {!message.isOwn &&
                        isGroupBreak &&
                        selectedConvo.type === "group" && (
                            <span className="text-xs text-muted-foreground px-1">
                                {participant?.displayName ?? "Unknown"}
                            </span>
                        )}

                    {/* Render media if present */}
                    {message.imgUrl ? (
                        (() => {
                            const url = message.imgUrl;
                            const lurl = (url || "").toLowerCase();
                            const ext =
                                lurl.split("?")[0].split(".").pop() || "";

                            const imageExt = [
                                "png",
                                "jpg",
                                "jpeg",
                                "gif",
                                "webp",
                                "svg",
                            ];
                            const audioExt = ["mp3", "wav", "ogg", "webm"];
                            const videoExt = ["mp4", "webm", "mov"];

                            if (imageExt.includes(ext)) {
                                return (
                                    <div className="bg-emerald-50 border-2 border-emerald-500 rounded-lg p-1 shadow-md">
                                        <img
                                            src={message.imgUrl}
                                            alt="media"
                                            className="max-w-full h-auto rounded-md"
                                        />
                                    </div>
                                );
                            }

                            if (audioExt.includes(ext)) {
                                return (
                                    <div className="bg-emerald-50 border-2 border-emerald-500 rounded-full px-3 py-2 shadow-md">
                                        <audio
                                            controls
                                            src={message.imgUrl}
                                            className="w-56 h-6"
                                        />
                                    </div>
                                );
                            }

                            if (videoExt.includes(ext)) {
                                return (
                                    <Card
                                        className={cn(
                                            "p-3",
                                            message.isOwn
                                                ? "chat-bubble-sent border-0"
                                                : "chat-bubble-received",
                                        )}
                                    >
                                        <video
                                            controls
                                            src={message.imgUrl}
                                            className="max-w-full rounded-md"
                                        />
                                    </Card>
                                );
                            }

                            // fallback: render filename (if provided in content) or link
                            const filename = message.content || "Tệp đính kèm";
                            return (
                                <Card
                                    className={cn(
                                        "p-3",
                                        message.isOwn
                                            ? "chat-bubble-sent border-0"
                                            : "chat-bubble-received",
                                    )}
                                >
                                    <a
                                        href={message.imgUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className={cn(
                                            "inline-flex items-center gap-2 text-sm underline decoration-2 underline-offset-2",
                                            message.isOwn
                                                ? "text-white"
                                                : "text-emerald-700 dark:text-emerald-400",
                                        )}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="1.5"
                                                d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="1.5"
                                                d="M14 2v6h6"
                                            />
                                        </svg>
                                        <span className="truncate max-w-[12rem] underline decoration-2 underline-offset-2">
                                            {filename}
                                        </span>
                                    </a>
                                </Card>
                            );
                        })()
                    ) : (
                        <Card
                            className={cn(
                                "p-3",
                                message.isOwn
                                    ? "chat-bubble-sent border-0"
                                    : "chat-bubble-received",
                            )}
                        >
                            <p className="text-sm leading-relaxed break-words">
                                {message.content}
                            </p>
                        </Card>
                    )}

                    {/* seen/ delivered */}
                    {message.isOwn &&
                        message._id === selectedConvo.lastMessage?._id && (
                            <Badge
                                variant="outline"
                                className={cn(
                                    "text-xs px-1.5 py-0.5 h-4 border-0",
                                    lastMessageStatus === "seen"
                                        ? "bg-primary/20 text-primary"
                                        : "bg-muted text-muted-foreground",
                                )}
                            >
                                {lastMessageStatus}
                            </Badge>
                        )}
                </div>
            </div>
        </>
    );
};

export default MessageItem;
