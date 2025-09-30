import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from "./routes/auth.route.js";
import donationsRoutes from './routes/donationsRoutes.js';
import ngoProfileRoutes from './routes/ngoProfileRoutes.js';
import userProfileRoutes from './routes/userProfileRoutes.js';
import chatbotRoutes from './routes/chatbotRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import { connectDB } from './config/db.js';
import { startExpiryChecker } from './utils/cronJobs.js';


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const PORT = process.env.PORT || 3004;

// Middleware

app.use(cors({
	origin: "http://localhost:5173",
	credentials: true
}));
app.use(express.json());
app.use(cookieParser()); // allows us to parse incoming cookies
app.use("/api/auth", authRoutes);

// Serve static files from uploads directory
const uploadsPath = path.join(__dirname, '../uploads');
console.log('Static uploads path:', uploadsPath);
app.use('/uploads', express.static(uploadsPath));
app.use((req, res, next) => {
  console.log(`Request Method: ${req.method}, Request URL: ${req.url}`);
  next();
});

app.use("/api/donations", donationsRoutes);
app.use("/api/ngo-profiles", ngoProfileRoutes);
app.use("/api/user-profile", userProfileRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/notifications", notificationRoutes);

// Dashboard and donation management system
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    // Start the expiry checker after server starts
    startExpiryChecker();
  });
});

