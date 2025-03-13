#!/bin/bash

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "Checking prerequisites..."
if ! command_exists docker; then
    echo "Error: Docker is not installed"
    exit 1
fi

if ! command_exists poetry; then
    echo "Error: Poetry is not installed"
    exit 1
fi

if ! command_exists npm; then
    echo "Error: npm is not installed"
    exit 1
fi

# Start Docker services
echo "Starting Docker services..."
docker-compose up -d

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
sleep 5

# Setup backend
echo "Setting up backend..."
cd backend

# Update poetry lock file and install dependencies
echo "Installing backend dependencies..."
poetry lock
poetry install

# Set up database
echo "Setting up database..."
poetry run alembic upgrade head

# Start backend server
echo "Starting backend server..."
poetry run uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!

# Setup frontend
echo "Setting up frontend..."
cd ../frontend

# Install frontend dependencies
echo "Installing frontend dependencies..."
npm install

# Start frontend development server
echo "Starting frontend server..."
npm run dev

# Cleanup on exit
trap 'kill $BACKEND_PID' EXIT 