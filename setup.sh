#!/bin/bash

echo "Setting up ContestSync project..."

# Install root dependencies
echo "Installing root dependencies..."
npm install

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install

# Generate Prisma client and push schema
echo "Setting up database..."
npm run db:generate
npm run db:push

# Go back to root
cd ..

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend
npm install

# Go back to root
cd ..

echo "Setup complete! Run 'npm run dev' to start the development servers."
echo "Backend will run on http://localhost:5001"
echo "Frontend will run on http://localhost:3000"