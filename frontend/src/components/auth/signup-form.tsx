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
import { UserPlus, Mail, Lock, User, Sparkles, ArrowRight } from "lucide-react";

const signUpSchema = z.object({
    firstname: z.string().min(1, "Tên bắt buộc phải có"),
    lastname: z.string().min(1, "Họ bắt buộc phải có"),
    username: z.string().min(3, "Tên đăng nhập phải có ít nhất 3 ký tự"),
    email: z.email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export function SignupForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const { signUp } = useAuthStore();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignUpFormValues>({
        resolver: zodResolver(signUpSchema),
    });

    const onSubmit = async (data: SignUpFormValues) => {
        const { firstname, lastname, username, email, password } = data;

        // gọi backend để signup
        await signUp(username, password, email, firstname, lastname);

        navigate("/signin");
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
                                <Sparkles className="w-12 h-12" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold mb-2">
                                    Chào mừng đến với Chat App
                                </h2>
                                <p className="text-emerald-100 text-lg">
                                    Kết nối, trò chuyện và chia sẻ khoảnh khắc
                                    với bạn bè
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-8">
                                <div className="text-center">
                                    <div className="w-12 h-12 mx-auto bg-white/20 rounded-lg flex items-center justify-center mb-2">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <p className="text-sm">Tạo hồ sơ cá nhân</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 mx-auto bg-white/20 rounded-lg flex items-center justify-center mb-2">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <p className="text-sm">Kết nối bạn bè</p>
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
                                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                                    <UserPlus className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        Tạo tài khoản
                                    </h1>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Điền thông tin để bắt đầu hành trình
                                    </p>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="px-0 space-y-6">
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="space-y-5"
                            >
                                {/* họ & tên */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="lastname"
                                            className="text-sm font-medium"
                                        >
                                            Họ
                                        </Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <Input
                                                type="text"
                                                id="lastname"
                                                placeholder="Nguyễn"
                                                className="pl-10 h-11 border-gray-200 dark:border-gray-700 focus:border-teal-500 focus:ring-teal-500"
                                                {...register("lastname")}
                                            />
                                        </div>
                                        {errors.lastname && (
                                            <p className="text-red-500 text-xs">
                                                {errors.lastname.message}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="firstname"
                                            className="text-sm font-medium"
                                        >
                                            Tên
                                        </Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <Input
                                                type="text"
                                                id="firstname"
                                                placeholder="Văn A"
                                                className="pl-10 h-11 border-gray-200 dark:border-gray-700 focus:border-teal-500 focus:ring-teal-500"
                                                {...register("firstname")}
                                            />
                                        </div>
                                        {errors.firstname && (
                                            <p className="text-red-500 text-xs">
                                                {errors.firstname.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* username */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="username"
                                        className="text-sm font-medium"
                                    >
                                        Tên đăng nhập
                                    </Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
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

                                {/* email */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="email"
                                        className="text-sm font-medium"
                                    >
                                        Email
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input
                                            type="email"
                                            id="email"
                                            placeholder="your@email.com"
                                            className="pl-10 h-11 border-gray-200 dark:border-gray-700 focus:border-teal-500 focus:ring-teal-500"
                                            {...register("email")}
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-red-500 text-xs">
                                            {errors.email.message}
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
                                            Đang tạo tài khoản...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            Tạo tài khoản
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    )}
                                </Button>
                            </form>

                            {/* sign in link */}
                            <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-gray-600 dark:text-gray-400">
                                    Đã có tài khoản?{" "}
                                    <button
                                        onClick={() => navigate("/signin")}
                                        className="text-teal-600 dark:text-teal-400 font-medium hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
                                    >
                                        Đăng nhập ngay
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
