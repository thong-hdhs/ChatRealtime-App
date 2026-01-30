import { Heart, Loader2 } from "lucide-react";
import { useState } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { User } from "@/types/user";
import { userService } from "@/services/userService";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";

type EditableField = {
    key: keyof Pick<User, "displayName" | "username" | "email" | "phone">;
    label: string;
    type?: string;
};

const PERSONAL_FIELDS: EditableField[] = [
    { key: "displayName", label: "Tên hiển thị" },
    { key: "username", label: "Tên người dùng" },
    { key: "email", label: "Email", type: "email" },
    { key: "phone", label: "Số điện thoại" },
];

type Props = {
    userInfo: User | null;
};

const PersonalInfoForm = ({ userInfo }: Props) => {
    const { user, setUser } = useAuthStore();
    const [formData, setFormData] = useState({
        displayName: userInfo?.displayName || "",
        username: userInfo?.username || "",
        email: userInfo?.email || "",
        phone: userInfo?.phone || "",
        bio: userInfo?.bio || "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        try {
            setLoading(true);

            const response = await userService.updateProfile({
                displayName: formData.displayName,
                phone: formData.phone || undefined,
                bio: formData.bio || undefined,
            });

            // Update auth store
            if (response.user) {
                setUser(response.user);
            }

            toast.success(response.message || "Cập nhật thành công");
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Có lỗi xảy ra";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    if (!userInfo) return null;

    return (
        <Card className="glass-strong border-border/30">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Heart className="size-5 text-primary" />
                    Thông tin cá nhân
                </CardTitle>
                <CardDescription>
                    Cập nhật chi tiết cá nhân và thông tin hồ sơ của bạn
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {PERSONAL_FIELDS.map(({ key, label, type }) => (
                        <div key={key} className="space-y-2">
                            <Label htmlFor={key}>{label}</Label>
                            <Input
                                id={key}
                                name={key}
                                type={type ?? "text"}
                                value={
                                    formData[key as keyof typeof formData] ?? ""
                                }
                                onChange={handleChange}
                                disabled={key === "username" || key === "email"}
                                className="glass-light border-border/30"
                            />
                            {(key === "username" || key === "email") && (
                                <p className="text-xs text-muted-foreground">
                                    Không thể thay đổi trường này
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="bio">Giới thiệu</Label>
                    <Textarea
                        id="bio"
                        name="bio"
                        rows={3}
                        value={formData.bio}
                        onChange={handleChange}
                        className="glass-light border-border/30 resize-none"
                        placeholder="Nhập giới thiệu về bạn..."
                        maxLength={500}
                    />
                    <p className="text-xs text-muted-foreground">
                        {formData.bio.length}/500 ký tự
                    </p>
                </div>

                <Button
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full md:w-auto bg-gradient-primary hover:opacity-90 transition-opacity"
                >
                    {loading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {loading ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
            </CardContent>
        </Card>
    );
};

export default PersonalInfoForm;
