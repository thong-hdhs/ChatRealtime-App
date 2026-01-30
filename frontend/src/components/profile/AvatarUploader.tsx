import { useUserStore } from "@/stores/useUserStore";
import { useRef } from "react";
import { Button } from "../ui/button";
import { Camera } from "lucide-react";
import { toast } from "sonner";

const AvatarUploader = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { updateAvatarUrl } = useUserStore();

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            return;
        }

        // Validate file type
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp",
        ];
        if (!allowedTypes.includes(file.type)) {
            toast.error("Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WebP)!");
            return;
        }

        // Validate file size (5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            toast.error("File quá lớn! Tối đa 5MB.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        await updateAvatarUrl(formData);
    };

    return (
        <>
            <Button
                size="icon"
                variant="secondary"
                onClick={handleClick}
                className="absolute -bottom-2 -right-2 size-9 rounded-full shadow-md hover:scale-115 transition duration-300 hover:bg-background"
            >
                <Camera className="size-4" />
            </Button>

            <input
                type="file"
                hidden
                ref={fileInputRef}
                onChange={handleUpload}
            />
        </>
    );
};

export default AvatarUploader;
