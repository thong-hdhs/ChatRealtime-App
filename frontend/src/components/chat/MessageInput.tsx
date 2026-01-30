import { useAuthStore } from "@/stores/useAuthStore";
import type { Conversation } from "@/types/chat";
import { useState, useRef } from "react";
import { Button } from "../ui/button";
import { ImagePlus, Send, Mic, StopCircle, FileText } from "lucide-react";
import { Input } from "../ui/input";
import EmojiPicker from "./EmojiPicker";
import { useChatStore } from "@/stores/useChatStore";
import { toast } from "sonner";
import { chatService } from "@/services/chatService";

const MessageInput = ({ selectedConvo }: { selectedConvo: Conversation }) => {
    const { user } = useAuthStore();
    const { sendDirectMessage, sendGroupMessage } = useChatStore();
    const [value, setValue] = useState("");
    const imageInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [recording, setRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<BlobPart[]>([]);

    if (!user) return;

    const sendMessage = async () => {
        if (!value.trim()) return;
        const currValue = value;
        setValue("");

        try {
            if (selectedConvo.type === "direct") {
                const participants = selectedConvo.participants;
                const otherUser = participants.filter(
                    (p) => p._id !== user._id,
                )[0];
                await sendDirectMessage(otherUser._id, currValue);
            } else {
                await sendGroupMessage(selectedConvo._id, currValue);
            }
        } catch (error) {
            console.error(error);
            toast.error("Lỗi xảy ra khi gửi tin nhắn. Bạn hãy thử lại!");
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="flex items-center gap-2 p-3 min-h-[56px] bg-background">
            {/* Image Upload Button */}
            <Button
                variant="ghost"
                size="icon"
                className="hover:bg-primary/10 transition-smooth"
                onClick={() => imageInputRef.current?.click()}
            >
                <ImagePlus className="size-4" />
            </Button>

            <input
                type="file"
                accept="image/*"
                hidden
                ref={imageInputRef}
                onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    const form = new FormData();
                    form.append("file", file);

                    try {
                        const res = await chatService.uploadFile(form);
                        const url =
                            res.url || res.data?.url || res.secure_url || res;

                        if (selectedConvo.type === "direct") {
                            const participants = selectedConvo.participants;
                            const otherUser = participants.filter(
                                (p) => p._id !== user._id,
                            )[0];
                            await sendDirectMessage(otherUser._id, "", url);
                        } else {
                            await sendGroupMessage(selectedConvo._id, "", url);
                        }
                    } catch (err) {
                        console.error("Upload image error", err);
                        toast.error("Không thể upload ảnh");
                    } finally {
                        e.currentTarget.value = "";
                    }
                }}
            />

            {/* File Upload Button */}
            <Button
                variant="ghost"
                size="icon"
                className="hover:bg-primary/10 transition-smooth"
                onClick={() => fileInputRef.current?.click()}
            >
                <FileText className="size-4" />
            </Button>

            <input
                type="file"
                accept="audio/*,video/*,application/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip"
                hidden
                ref={fileInputRef}
                onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    const form = new FormData();
                    form.append("file", file);

                    try {
                        const res = await chatService.uploadFile(form);
                        const url =
                            res.url || res.data?.url || res.secure_url || res;

                        if (selectedConvo.type === "direct") {
                            const participants = selectedConvo.participants;
                            const otherUser = participants.filter(
                                (p) => p._id !== user._id,
                            )[0];
                            await sendDirectMessage(
                                otherUser._id,
                                file.name,
                                url,
                            );
                        } else {
                            await sendGroupMessage(
                                selectedConvo._id,
                                file.name,
                                url,
                            );
                        }
                    } catch (err) {
                        console.error("Upload file error", err);
                        toast.error("Không thể upload tệp");
                    } finally {
                        e.currentTarget.value = "";
                    }
                }}
            />

            <Button
                variant="ghost"
                size="icon"
                className="hover:bg-primary/10 transition-smooth"
                onClick={async () => {
                    if (!recording) {
                        // start recording
                        try {
                            const stream =
                                await navigator.mediaDevices.getUserMedia({
                                    audio: true,
                                });
                            const mr = new MediaRecorder(stream);
                            audioChunksRef.current = [];
                            mr.ondataavailable = (ev) =>
                                audioChunksRef.current.push(ev.data);
                            mr.onstop = async () => {
                                const blob = new Blob(audioChunksRef.current, {
                                    type: "audio/webm",
                                });
                                const file = new File(
                                    [blob],
                                    `voice-${Date.now()}.webm`,
                                    { type: blob.type },
                                );
                                const form = new FormData();
                                form.append("file", file);

                                try {
                                    const res =
                                        await chatService.uploadFile(form);
                                    const url =
                                        res.url ||
                                        res.data?.url ||
                                        res.secure_url ||
                                        res;

                                    if (selectedConvo.type === "direct") {
                                        const participants =
                                            selectedConvo.participants;
                                        const otherUser = participants.filter(
                                            (p) => p._id !== user._id,
                                        )[0];
                                        await sendDirectMessage(
                                            otherUser._id,
                                            "",
                                            url,
                                        );
                                    } else {
                                        await sendGroupMessage(
                                            selectedConvo._id,
                                            "",
                                            url,
                                        );
                                    }
                                } catch (err) {
                                    console.error("Upload voice error", err);
                                    toast.error("Không thể upload ghi âm");
                                }
                            };
                            mr.start();
                            mediaRecorderRef.current = mr;
                            setRecording(true);
                        } catch (err) {
                            console.error("Cannot access microphone", err);
                            toast.error("Không thể truy cập micro");
                        }
                    } else {
                        // stop recording
                        mediaRecorderRef.current?.stop();
                        setRecording(false);
                    }
                }}
            >
                {recording ? (
                    <StopCircle className="size-4" />
                ) : (
                    <Mic className="size-4" />
                )}
            </Button>

            <div className="flex-1 relative">
                <Input
                    onKeyPress={handleKeyPress}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Soạn tin nhắn..."
                    className="pr-20 h-9 bg-white border-border/50 focus:border-primary/50 transition-smooth resize-none"
                ></Input>
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                    <Button
                        asChild
                        variant="ghost"
                        size="icon"
                        className="size-8 hover:bg-primary/10 transition-smooth"
                    >
                        <div>
                            <EmojiPicker
                                onChange={(emoji: string) =>
                                    setValue(`${value}${emoji}`)
                                }
                            />
                        </div>
                    </Button>
                </div>
            </div>

            <Button
                onClick={sendMessage}
                className="bg-gradient-chat hover:shadow-glow transition-smooth hover:scale-105"
                disabled={!value.trim()}
            >
                <Send className="size-4 text-white" />
            </Button>
        </div>
    );
};

export default MessageInput;
