#!/bin/bash

# Health Tracker - Frontend Start Script

echo "🚀 Starting Health Tracker Frontend..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
fi

# Start the development server
echo "Starting Vite dev server on http://localhost:5173"
npm run dev
