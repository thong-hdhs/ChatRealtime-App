import { SidebarInset } from "../ui/sidebar";
import ChatWindowHeader from "./ChatWindowHeader";

const ChatWelcomeScreen = () => {
    return (
        <SidebarInset className="flex w-full h-full bg-transparent">
            <ChatWindowHeader />

            <div className="flex-1 flex items-center justify-center bg-primary-foreground min-h-0">
                <div className="relative w-full max-w-3xl px-6 py-20">
                    {/* decorative lights */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute -left-24 top-12 w-56 h-56 bg-emerald-300/30 rounded-full blur-3xl animate-blob" />
                        <div className="absolute right-12 bottom-20 w-40 h-40 bg-cyan-300/25 rounded-full blur-2xl animate-blob delay-2000" />
                    </div>

                    <div className="relative bg-white/50 dark:bg-slate-900/40 backdrop-blur-md rounded-3xl p-12 shadow-2xl border border-white/20 dark:border-slate-800/20">
                        <div className="flex flex-col items-center text-center gap-6">
                            <div className="w-36 h-36 rounded-full bg-gradient-to-br from-teal-400 via-emerald-500 to-cyan-500 flex items-center justify-center shadow-2xl transform-gpu animate-pulse-slow">
                                <div className="w-16 h-16 rounded-full bg-white/95 flex items-center justify-center text-4xl">
                                    💬
                                </div>
                            </div>

                            <h2 className="text-5xl font-extrabold leading-tight bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                                Chào mừng bạn đến với Chat App!
                            </h2>

                            <p className="text-base text-muted-foreground max-w-2xl">
                                Bắt đầu bằng cách chọn một cuộc hội thoại ở
                                thanh bên — hoặc nhấn biểu tượng "+" để tạo
                                nhanh.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </SidebarInset>
    );
};

export default ChatWelcomeScreen;
