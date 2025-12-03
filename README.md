# ContestSync - All Competitive Programming Contests in One Place

A full-stack web application that centralizes competitive programming contests from multiple platforms including Codeforces, LeetCode, AtCoder, and HackerRank.

## Features

- **Contest Aggregation**: Fetches contests from multiple platforms via APIs
- **User Authentication**: JWT-based login/signup with role-based access
- **Contest Management**: View, filter, search, and paginate contests
- **Reminders**: Set reminders for upcoming contests
- **Contest History**: Track participation with visual charts
- **Admin Dashboard**: User management and analytics
- **Leaderboard**: Top users based on contest participation
- **Dark/Light Mode**: Toggle between themes
- **Auto-Sync**: Automated contest data updates via cron jobs

## Tech Stack

### Frontend
- React.js with React Router
- Tailwind CSS for styling
- Chart.js for data visualization
- Axios for API calls

### Backend
- Node.js with Express.js
- Prisma ORM with PostgreSQL
- JWT authentication
- Node-cron for scheduled tasks

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ContestSync
```

2. Install dependencies:
```bash
npm run install-all
```

3. Set up the database:
```bash
cd backend
npm run db:generate
npm run db:push
```

4. Start the development servers:
```bash
npm run dev
```

This will start:
- Backend server on http://localhost:5001
- Frontend server on http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Contests
- `GET /api/contests` - Get contests with filtering and pagination
- `POST /api/contests/:id/reminder` - Set contest reminder
- `DELETE /api/contests/:id/reminder` - Remove contest reminder

### User
- `GET /api/user/history` - Get user's contest history
- `POST /api/user/history/add` - Add contest participation
- `GET /api/user/history/questions` - Get total questions solved

### Admin
- `GET /api/admin/users` - Get all users (Admin only)
- `DELETE /api/admin/users/:id` - Delete user (Admin only)
- `GET /api/admin/overview` - Get system overview (Admin only)
- `GET /api/admin/leaderboard` - Get leaderboard

## External APIs Integrated

- **Codeforces**: https://codeforces.com/api/contest.list
- **LeetCode**: https://leetcode.com/contest/api/list/
- **AtCoder**: https://kontests.net/api/v1/at_coder
- **HackerRank**: https://kontests.net/api/v1/hacker_rank

## Database Schema

The application uses PostgreSQL with the following main models:
- **User**: User accounts with authentication
- **Contest**: Contest information from various platforms
- **Reminder**: User reminders for contests
- **ContestHistory**: User participation tracking

## Deployment

### Frontend (Vercel)
1. Build the frontend: `cd frontend && npm run build`
2. Deploy to Vercel

### Backend (Render)
1. Set environment variables in Render dashboard
2. Deploy from GitHub repository

## Environment Variables

Create a `.env` file in the backend directory:
```
DATABASE_URL="your-postgresql-connection-string"
JWT_SECRET="your-jwt-secret"
PORT=5000
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.