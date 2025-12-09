# ContestSync 🏆

A full-stack web application for tracking competitive programming contests across multiple platforms (Codeforces, LeetCode, AtCoder, HackerRank).

## Features

- 🔐 User authentication (JWT)
- 📅 Contest aggregation from multiple platforms
- ⏰ Contest reminders
- 📊 Admin panel for contest management
- 👥 User management
- 📈 Contest history tracking
- 🎯 Leaderboard

## Tech Stack

### Backend
- Node.js + Express
- PostgreSQL + Prisma ORM
- JWT Authentication
- Node-cron for scheduled tasks

### Frontend
- React
- React Router
- Axios
- Tailwind CSS

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npx prisma generate
npx prisma db push
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## Project Structure

```
ContestSync/
├── backend/
│   ├── middleware/      # Auth middleware
│   ├── prisma/         # Database schema
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   └── server.js       # Entry point
└── frontend/
    ├── src/
    │   ├── components/ # React components
    │   ├── config/     # Configuration
    │   └── context/    # React context
    └── public/
```

## License

MIT
