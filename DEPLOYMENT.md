# ContestSync Deployment Guide

## Prerequisites
- PostgreSQL database (use Neon, Supabase, or Railway)
- GitHub account
- Vercel account (for frontend)
- Render/Railway account (for backend)

## Backend Deployment (Render)

1. Go to [render.com](https://render.com) and sign in
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: contestsync-backend
   - **Root Directory**: backend
   - **Build Command**: `npm install && npx prisma generate && npx prisma db push`
   - **Start Command**: `npm start`
5. Add environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `JWT_SECRET`: Random secure string (generate with `openssl rand -base64 32`)
   - `PORT`: 5001
   - `FRONTEND_URL`: Your Vercel frontend URL
6. Click "Create Web Service"

## Frontend Deployment (Vercel)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: frontend
   - **Build Command**: `npm run build`
   - **Output Directory**: build
5. Add environment variable:
   - `REACT_APP_API_URL`: Your backend URL (e.g., `https://contestsync-backend.onrender.com`)
6. Click "Deploy"

## Database Setup (Neon - Free PostgreSQL)

1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Use it as `DATABASE_URL` in backend

## Post-Deployment

1. Create an admin user by registering and manually updating the database:
   ```sql
   UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';
   ```
2. Test the deployment

## Environment Variables

### Backend
```
DATABASE_URL="postgresql://user:password@host:5432/database"
JWT_SECRET="your-super-secret-jwt-key"
PORT=5001
FRONTEND_URL="https://your-frontend.vercel.app"
```

### Frontend
```
REACT_APP_API_URL="https://your-backend.onrender.com"
```
