import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from "./routes/auth.route.js";
import donationsRoutes from './routes/donationsRoutes.js';
import { connectDB } from './config/db.js';


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const PORT = process.env.PORT || 3001;

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

// Dashboard and donation management system
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

