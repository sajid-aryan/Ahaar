# Ahaar App - Vercel Deployment Guide

This guide will help you deploy the Ahaar application to Vercel with both frontend and backend components.

## Architecture

- **Frontend**: React + Vite application
- **Backend**: Node.js + Express API
- **Database**: MongoDB (external)

## Deployment Steps

### 1. Backend Deployment

1. **Deploy to Vercel**:
   ```bash
   cd backend
   vercel
   ```

2. **Set Environment Variables** in Vercel dashboard:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure JWT secret key
   - `GEMINI_API_KEY`: Your Google Gemini API key
   - `FRONTEND_URL`: Your frontend deployment URL (will be added after frontend deployment)

3. **Note the backend URL** for the next step.

### 2. Frontend Deployment

1. **Update environment variables**:
   Create `.env` file in frontend directory:
   ```
   VITE_API_BASE_URL=https://your-backend-deployment.vercel.app
   ```

2. **Deploy to Vercel**:
   ```bash
   cd frontend
   vercel
   ```

3. **Set Environment Variables** in Vercel dashboard:
   - `VITE_API_BASE_URL`: Your backend deployment URL from step 1

### 3. Update CORS Configuration

After frontend deployment, update the backend environment variables:
- Add `FRONTEND_URL` with your frontend deployment URL
- Redeploy backend if needed

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-super-secure-jwt-secret-key
GEMINI_API_KEY=your-gemini-api-key
FRONTEND_URL=https://your-frontend-deployment.vercel.app
```

### Frontend (.env)
```
VITE_API_BASE_URL=https://your-backend-deployment.vercel.app
```

## Features Included

✅ **User Authentication** - JWT-based auth with cookies
✅ **Donation Management** - Create, browse, claim donations
✅ **NGO Profiles** - Organization profiles and verification
✅ **Admin Dashboard** - User verification and content moderation
✅ **Report System** - Report inappropriate content
✅ **Notification System** - Real-time notifications
✅ **Chatbot Integration** - AI-powered assistance

## File Structure for Vercel

```
/
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── vercel.json
│   └── .env
├── backend/
│   ├── src/
│   ├── package.json
│   ├── vercel.json
│   └── .env
└── vercel.json (root configuration)
```

## Troubleshooting

### CORS Issues
- Ensure `FRONTEND_URL` is set in backend environment variables
- Check that frontend URL is added to `allowedOrigins` in server.js

### API Connection Issues
- Verify `VITE_API_BASE_URL` points to correct backend URL
- Ensure both deployments are using HTTPS

### Database Connection
- Verify MongoDB URI is correct
- Ensure MongoDB allows connections from Vercel IPs (0.0.0.0/0 for simplicity)

## Admin Access

Default admin credentials (change after first login):
- Email: `sami@gmail.com`
- Check database for user type

## Support

For deployment issues, check:
1. Vercel deployment logs
2. Environment variables configuration
3. Database connectivity
4. CORS settings