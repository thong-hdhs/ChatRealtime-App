import { SidebarInset } from "../ui/sidebar";
import ChatWindowHeader from "./ChatWindowHeader";

const ChatWelcomeScreen = () => {
    return (
        <SidebarInset className="flex w-full h-full bg-transparent">
            <ChatWindowHeader />
            <div className="flex bg-primary-foreground rounded-2xl flex-1 items-center justify-center">
                <div className="text-center">
                    <div className="size-24 mx-auto mb-6 bg-gradient-chat rounded-full flex items-center justify-center shadow-glow pulse-ring">
                        <span className="text-3xl">💬</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-2 bg-gradient-chat bg-clip-text text-transparent">
                        Chào mừng bạn đến với Chat App!
                    </h2>
                    <p className="text-muted-foreground">
                        Chọn một cuộc hội thoại để bắt đầu chat!
                    </p>
                </div>
            </div>
        </SidebarInset>
    );
};

export default ChatWelcomeScreen;
