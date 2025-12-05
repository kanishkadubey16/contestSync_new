<<<<<<< HEAD
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
=======
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
>>>>>>> d4fcffa28452773cfc749832faa872e683ed82ed
