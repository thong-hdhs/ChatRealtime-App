import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "../ui/label";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router";
import { LogIn, Mail, Lock, MessageCircle, ArrowRight } from "lucide-react";

const signInSchema = z.object({
    username: z.string().min(3, "Tên đăng nhập phải có ít nhất 3 ký tự"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export function SigninForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const { signIn } = useAuthStore();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignInFormValues>({
        resolver: zodResolver(signInSchema),
    });

    const onSubmit = async (data: SignInFormValues) => {
        const { username, password } = data;
        await signIn(username, password);
        navigate("/");
    };

    return (
        <div className={cn("w-full", className)} {...props}>
            <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-0 shadow-2xl overflow-hidden">
                <div className="grid lg:grid-cols-2 min-h-[500px]">
                    {/* Left side - Illustration */}
                    <div className="hidden lg:flex flex-col items-center justify-center p-8 bg-gradient-to-br from-teal-500 via-emerald-500 to-cyan-500 text-white relative overflow-hidden">
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="relative z-10 text-center space-y-6">
                            <div className="w-24 h-24 mx-auto bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <MessageCircle className="w-12 h-12" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold mb-2">
                                    Chào mừng trở lại!
                                </h2>
                                <p className="text-teal-100 text-lg">
                                    Tiếp tục cuộc trò chuyện với bạn bè của bạn
                                </p>
                            </div>
                            <div className="grid grid-cols-1 gap-4 mt-8">
                                <div className="text-center">
                                    <div className="w-12 h-12 mx-auto bg-white/20 rounded-lg flex items-center justify-center mb-2">
                                        <MessageCircle className="w-6 h-6" />
                                    </div>
                                    <p className="text-sm">
                                        Trò chuyện real-time
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute top-10 right-10 w-20 h-20 bg-white/10 rounded-full animate-bounce"></div>
                        <div className="absolute bottom-10 left-10 w-16 h-16 bg-white/10 rounded-full animate-bounce delay-500"></div>
                    </div>

                    {/* Right side - Form */}
                    <div className="p-8 flex flex-col justify-center">
                        <CardHeader className="px-0 pb-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                    <LogIn className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        Đăng nhập
                                    </h1>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Nhập thông tin để tiếp tục
                                    </p>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="px-0 space-y-6">
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="space-y-5"
                            >
                                {/* username */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="username"
                                        className="text-sm font-medium"
                                    >
                                        Tên đăng nhập
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input
                                            type="text"
                                            id="username"
                                            placeholder="chatapp"
                                            className="pl-10 h-11 border-gray-200 dark:border-gray-700 focus:border-teal-500 focus:ring-teal-500"
                                            {...register("username")}
                                        />
                                    </div>
                                    {errors.username && (
                                        <p className="text-red-500 text-xs">
                                            {errors.username.message}
                                        </p>
                                    )}
                                </div>

                                {/* password */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="password"
                                        className="text-sm font-medium"
                                    >
                                        Mật khẩu
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input
                                            type="password"
                                            id="password"
                                            placeholder="••••••••"
                                            className="pl-10 h-11 border-gray-200 dark:border-gray-700 focus:border-teal-500 focus:ring-teal-500"
                                            {...register("password")}
                                        />
                                    </div>
                                    {errors.password && (
                                        <p className="text-red-500 text-xs">
                                            {errors.password.message}
                                        </p>
                                    )}
                                </div>

                                {/* submit button */}
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full h-12 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Đang đăng nhập...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            Đăng nhập
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    )}
                                </Button>
                            </form>

                            {/* sign up link */}
                            <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-gray-600 dark:text-gray-400">
                                    Chưa có tài khoản?{" "}
                                    <button
                                        onClick={() => navigate("/signup")}
                                        className="text-teal-600 dark:text-teal-400 font-medium hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
                                    >
                                        Đăng ký ngay
                                    </button>
                                </p>
                            </div>
                        </CardContent>
                    </div>
                </div>
            </Card>
        </div>
    );
}
