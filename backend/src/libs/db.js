import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const connectionString =
            process.env.MONGODB_CONNECTIONSTRING ||
            "mongodb+srv://thanhdung41f_db_user:iKGZq2wEFmAFA8ve@cluster0.xb8ajiw.mongodb.net/?appName=Cluster0";
        console.log("Using connection string:", connectionString);
        // @ts-ignore
        await mongoose.connect(connectionString, {
            serverSelectionTimeoutMS: 5000,
        }); // Add timeout
        console.log("Liên kết CSDL thành công!");
    } catch (error) {
        console.log("Lỗi khi kết nối CSDL:", error);
        throw error; // Throw to reject promise
    }
};
