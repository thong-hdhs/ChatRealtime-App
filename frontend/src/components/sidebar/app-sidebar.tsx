import { useState } from "react";
import { NavUser } from "@/components/sidebar/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
} from "@/components/ui/sidebar";
import { Moon, Sun, MessageSquare, Users, Sparkles, Plus } from "lucide-react";
import { Switch } from "../ui/switch";
import { Dialog, DialogTrigger } from "../ui/dialog";
import NewGroupChatModal from "../chat/NewGroupChatModal";
import GroupChatList from "../chat/GroupChatList";
import AddFriendModal from "../chat/AddFriendModal";
import DirectMessageList from "../chat/DirectMessageList";
import { useThemeStore } from "@/stores/useThemeStore";
import { useAuthStore } from "@/stores/useAuthStore";
import ConversationSkeleton from "../skeleton/ConversationSkeleton";
import { useChatStore } from "@/stores/useChatStore";
import { useFriendStore } from "@/stores/useFriendStore";
import FriendListModal from "../createNewChat/FriendListModal";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { isDark, toggleTheme } = useThemeStore();
    const { user } = useAuthStore();
    const { convoLoading } = useChatStore();
    const { getFriends } = useFriendStore();
    const [showGroupChats, setShowGroupChats] = useState(false);

    const handleGetFriends = async () => {
        await getFriends();
    };

    return (
        <Sidebar
            variant="inset"
            {...props}
            className="border-r-0 bg-gradient-to-b from-slate-50/80 via-white/60 to-slate-100/40 dark:from-slate-900/80 dark:via-slate-800/60 dark:to-slate-900/40 backdrop-blur-xl relative overflow-hidden"
        >
            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
                <div className="absolute top-10 left-6 w-20 h-20 bg-teal-500 rounded-full blur-xl animate-pulse" />
                <div className="absolute bottom-32 right-8 w-16 h-16 bg-emerald-500 rounded-full blur-lg animate-pulse delay-1000" />
                <div className="absolute top-1/3 left-1/4 w-12 h-12 bg-cyan-500 rounded-full blur-md animate-pulse delay-500" />
            </div>

            {/* Header - Clean Layout (title left, no logo) */}
            <SidebarHeader className="relative z-10 p-4 pb-8">
                <div className="flex items-center justify-between">
                    {/* Brand Text - Left (prominent) */}
                    <div className="flex-1 text-left pl-2">
                        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 bg-clip-text text-transparent leading-tight">
                            ChatApp
                        </h1>
                    </div>

                    {/* Theme Toggle - Right */}
                    <div className="bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm rounded-lg p-1.5 shadow-md border border-white/40 dark:border-slate-600/40">
                        <div className="flex items-center gap-1.5">
                            <Sun className="w-3.5 h-3.5 text-amber-500 transition-opacity" />
                            <Switch
                                checked={isDark}
                                onCheckedChange={toggleTheme}
                                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-teal-500 data-[state=checked]:to-emerald-500 transition-all duration-300 scale-90"
                            />
                            <Moon className="w-3.5 h-3.5 text-slate-400 dark:text-slate-300 transition-opacity" />
                        </div>
                    </div>
                </div>
            </SidebarHeader>

            {/* Plus Button Section */}
            <div className="relative z-10 px-3 pb-3">
                <div className="bg-gradient-to-r from-teal-500/10 via-emerald-500/5 to-cyan-500/10 rounded-2xl p-4 border border-teal-500/20 dark:border-teal-500/10 shadow-xl shadow-teal-500/10">
                    <div className="flex items-center justify-center gap-3">
                        <Dialog>
                            <DialogTrigger asChild>
                                <div
                                    className="relative group cursor-pointer"
                                    onClick={handleGetFriends}
                                >
                                    <div className="w-12 h-12 bg-gradient-to-br from-teal-400 via-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl shadow-teal-500/25 transform group-hover:scale-110 transition-all duration-300 ease-out">
                                        <Plus className="w-6 h-6 text-white drop-shadow-sm" />
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center shadow-lg animate-bounce">
                                        <Sparkles className="w-2 h-2 text-white" />
                                    </div>
                                    <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-gradient-to-br from-pink-400 to-purple-500 rounded-md animate-ping opacity-75" />
                                </div>
                            </DialogTrigger>
                            <FriendListModal />
                        </Dialog>

                        <div className="text-center space-y-0.5">
                            <p className="text-sm font-semibold text-foreground">
                                Tạo cuộc trò chuyện
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Bắt đầu chat với bạn bè
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Sections - Single Block Layout */}
            <SidebarContent className="beautiful-scrollbar relative z-10 px-3 pb-3 flex-1">
                <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-white/30 dark:border-slate-700/30 h-full flex flex-col">
                    {/* Tab Headers */}
                    <div className="flex items-center gap-2 mb-3 p-1.5 bg-slate-100/50 dark:bg-slate-700/50 rounded-xl flex-shrink-0">
                        {/* Direct Messages Tab */}
                        <button
                            onClick={() => setShowGroupChats(false)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 px-2.5 rounded-lg transition-all duration-300 ${
                                !showGroupChats
                                    ? "bg-gradient-to-r from-teal-500/20 to-teal-600/20 text-teal-700 dark:text-teal-300 shadow-md"
                                    : "text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-slate-600/50"
                            }`}
                        >
                            <Users className="w-4 h-4" />
                            <span className="text-sm font-medium">
                                Chat 1-1
                            </span>
                        </button>

                        {/* Group Chats Tab */}
                        <button
                            onClick={() => setShowGroupChats(true)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 px-2.5 rounded-lg transition-all duration-300 ${
                                showGroupChats
                                    ? "bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 text-emerald-700 dark:text-emerald-300 shadow-md"
                                    : "text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-slate-600/50"
                            }`}
                        >
                            <MessageSquare className="w-4 h-4" />
                            <span className="text-sm font-medium">Nhóm</span>
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 flex flex-col space-y-3 min-h-0">
                        {/* Action Button */}
                        <div className="flex items-center justify-between flex-shrink-0">
                            <div className="flex items-center gap-2">
                                <div
                                    className={`w-7 h-7 rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 ${
                                        showGroupChats
                                            ? "bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 group-hover:shadow-emerald-500/20"
                                            : "bg-gradient-to-br from-teal-500/20 to-teal-600/20 group-hover:shadow-teal-500/20"
                                    }`}
                                >
                                    {showGroupChats ? (
                                        <MessageSquare
                                            className={`w-4 h-4 ${showGroupChats ? "text-emerald-600" : "text-teal-600"}`}
                                        />
                                    ) : (
                                        <Users
                                            className={`w-4 h-4 ${showGroupChats ? "text-emerald-600" : "text-teal-600"}`}
                                        />
                                    )}
                                </div>
                                <div className="space-y-0.5">
                                    <h3 className="text-sm font-bold text-foreground leading-tight">
                                        {showGroupChats ? "Nhóm" : "Chat 1-1"}
                                    </h3>
                                    <p className="text-xs text-muted-foreground font-medium">
                                        {showGroupChats
                                            ? "Nhiều người"
                                            : "Riêng tư"}
                                    </p>
                                </div>
                            </div>
                            <div className="transition-opacity duration-300">
                                {showGroupChats ? (
                                    <NewGroupChatModal />
                                ) : (
                                    <AddFriendModal />
                                )}
                            </div>
                        </div>

                        {/* Chat List */}
                        <div className="flex-1 overflow-hidden min-h-0">
                            <div className="space-y-2 h-full overflow-y-auto beautiful-scrollbar pr-2 max-h-full">
                                {convoLoading ? (
                                    <div className="space-y-2">
                                        <ConversationSkeleton />
                                        <ConversationSkeleton />
                                    </div>
                                ) : showGroupChats ? (
                                    <GroupChatList />
                                ) : (
                                    <DirectMessageList />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* User Profile at Bottom */}
                    <div className="mt-3 pt-3 border-t border-white/20 dark:border-slate-700/20 flex-shrink-0">
                        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-3 shadow-xl border border-white/40 dark:border-slate-700/40 hover:shadow-lg transition-all duration-300">
                            {user && <NavUser user={user} />}
                        </div>
                    </div>
                </div>
            </SidebarContent>
        </Sidebar>
    );
}
