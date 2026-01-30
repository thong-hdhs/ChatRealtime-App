import axios from "axios";
import FormData from "form-data";
import fs from "fs";

// Giả sử bạn có access token
const accessToken = "your_access_token_here"; // Thay bằng token thật

const testUploadAvatar = async () => {
    try {
        const formData = new FormData();
        // Tạo một file buffer giả lập (hoặc dùng file thật)
        const buffer = fs.readFileSync("path/to/your/image.jpg"); // Thay bằng path ảnh thật
        formData.append("file", buffer, "avatar.jpg");

        const response = await axios.post(
            "http://localhost:5001/api/users/uploadAvatar",
            formData,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    ...formData.getHeaders(),
                },
            },
        );

        console.log("Upload thành công:", response.data);
    } catch (error) {
        console.error("Lỗi upload:", error.response?.data || error.message);
    }
};

testUploadAvatar();
