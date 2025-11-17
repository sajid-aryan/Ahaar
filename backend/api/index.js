import app from '../src/server.js';
import { connectDB } from '../src/config/db.js';

let dbConnected = false;

export default async function handler(req, res) {
  // Ensure DB is connected before handling requests
  if (!dbConnected) {
    try {
      await connectDB();
      dbConnected = true;
    } catch (error) {
      console.error('Failed to connect to database:', error);
      return res.status(500).json({ error: 'Database connection failed' });
    }
  }
  
  // Pass request to Express app
  return app(req, res);
}
