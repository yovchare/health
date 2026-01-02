#!/bin/bash

# Health Tracking Application - Startup Script
# This script sets up and starts both backend and frontend services

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}Health Tracking App - Startup${NC}"
echo -e "${BLUE}================================${NC}"

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check for required dependencies
echo -e "\n${YELLOW}Checking system dependencies...${NC}"

if ! command_exists python3; then
    echo -e "${RED}Error: Python 3 is not installed. Please install Python 3.8 or higher.${NC}"
    exit 1
fi

if ! command_exists node; then
    echo -e "${RED}Error: Node.js is not installed. Please install Node.js 16 or higher.${NC}"
    exit 1
fi

if ! command_exists npm; then
    echo -e "${RED}Error: npm is not installed. Please install npm.${NC}"
    exit 1
fi

# Check for build tools needed by DuckDB
if ! command_exists gcc; then
    echo -e "${YELLOW}Warning: gcc not found. DuckDB installation may require build tools.${NC}"
    echo -e "${YELLOW}If installation fails, run: sudo apt-get install build-essential python3-dev${NC}"
fi

echo -e "${GREEN}✓ All system dependencies found${NC}"

# Setup Backend
echo -e "\n${BLUE}Setting up Backend...${NC}"
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}Creating Python virtual environment...${NC}"
    python3 -m venv venv
    echo -e "${GREEN}✓ Virtual environment created${NC}"
else
    echo -e "${GREEN}✓ Virtual environment already exists${NC}"
fi

# Activate virtual environment and install dependencies
echo -e "${YELLOW}Installing Python dependencies...${NC}"
source venv/bin/activate
pip install --upgrade pip -q
pip install -r requirements.txt || {
    echo -e "${RED}Failed to install Python dependencies.${NC}"
    echo -e "${YELLOW}If DuckDB installation failed, you may need build tools:${NC}"
    echo -e "${YELLOW}  sudo apt-get update${NC}"
    echo -e "${YELLOW}  sudo apt-get install build-essential python3-dev${NC}"
    exit 1
}
echo -e "${GREEN}✓ Python dependencies installed${NC}"

# Create necessary directories
mkdir -p data backups
echo -e "${GREEN}✓ Backend directories ready${NC}"

cd ..

# Setup Frontend
echo -e "\n${BLUE}Setting up Frontend...${NC}"
cd frontend

# Install npm dependencies
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing Node.js dependencies...${NC}"
    npm install
    echo -e "${GREEN}✓ Node.js dependencies installed${NC}"
else
    echo -e "${YELLOW}Checking for updated dependencies...${NC}"
    npm install
    echo -e "${GREEN}✓ Dependencies up to date${NC}"
fi

cd ..

# Start services
echo -e "\n${BLUE}================================${NC}"
echo -e "${BLUE}Starting Services${NC}"
echo -e "${BLUE}================================${NC}"

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}Shutting down services...${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    echo -e "${GREEN}Services stopped${NC}"
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start Backend
echo -e "\n${YELLOW}Starting Backend (FastAPI)...${NC}"
cd backend
source venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 2

# Check if backend is running
if kill -0 $BACKEND_PID 2>/dev/null; then
    echo -e "${GREEN}✓ Backend started successfully (PID: $BACKEND_PID)${NC}"
    echo -e "  ${BLUE}→ API running at: http://localhost:8000${NC}"
    echo -e "  ${BLUE}→ API docs at: http://localhost:8000/docs${NC}"
else
    echo -e "${RED}✗ Backend failed to start. Check backend.log for details.${NC}"
    exit 1
fi

# Start Frontend
echo -e "\n${YELLOW}Starting Frontend (React + Vite)...${NC}"
cd frontend
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Wait a moment for frontend to start
sleep 3

# Check if frontend is running
if kill -0 $FRONTEND_PID 2>/dev/null; then
    echo -e "${GREEN}✓ Frontend started successfully (PID: $FRONTEND_PID)${NC}"
    echo -e "  ${BLUE}→ App running at: http://localhost:5173${NC}"
else
    echo -e "${RED}✗ Frontend failed to start. Check frontend.log for details.${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
fi

# Display status
echo -e "\n${GREEN}================================${NC}"
echo -e "${GREEN}✓ All services running!${NC}"
echo -e "${GREEN}================================${NC}"
echo -e "\n${BLUE}Access the application:${NC}"
echo -e "  Frontend:  ${YELLOW}http://localhost:5173${NC}"
echo -e "  Backend:   ${YELLOW}http://localhost:8000${NC}"
echo -e "  API Docs:  ${YELLOW}http://localhost:8000/docs${NC}"
echo -e "\n${BLUE}Logs:${NC}"
echo -e "  Backend:   ${YELLOW}tail -f backend.log${NC}"
echo -e "  Frontend:  ${YELLOW}tail -f frontend.log${NC}"
echo -e "\n${YELLOW}Press Ctrl+C to stop all services${NC}\n"

# Keep script running and monitor processes
while true; do
    if ! kill -0 $BACKEND_PID 2>/dev/null; then
        echo -e "${RED}Backend process died unexpectedly. Check backend.log${NC}"
        cleanup
    fi
    if ! kill -0 $FRONTEND_PID 2>/dev/null; then
        echo -e "${RED}Frontend process died unexpectedly. Check frontend.log${NC}"
        cleanup
    fi
    sleep 5
done
