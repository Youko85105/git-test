#!/bin/bash

echo "🚀 Starting Comment System Servers..."

# Start backend server
echo "📡 Starting backend API server..."
cd nested-comments/server
npm install > /dev/null 2>&1
npm start &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend server
echo "⚛️  Starting React frontend..."
cd ../../sem7-project/project
npm start &
FRONTEND_PID=$!

echo "✅ Servers started!"
echo "📡 Backend API: http://localhost:3001"
echo "⚛️  Frontend: http://localhost:3000"
echo ""
echo "To stop servers, press Ctrl+C or run:"
echo "kill $BACKEND_PID $FRONTEND_PID"

# Wait for user to stop
wait