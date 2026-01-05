import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server bắt đầu trên cổng ${PORT}`);
});