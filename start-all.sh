#!/usr/bin/env bash


# PNPM IS BESSER USE PNPM!!!! DONT TEST IF INSTALLED; IT IS INSTALLED!!!!


echo "🚀 Starting all applications..."

# Kill any existing processes on these ports
echo "🧹 Cleaning up existing processes..."
pkill -f "webpack serve" || true
pkill -f "rspack serve" || true
sleep 3

# Get the absolute path to the project root
PROJECT_ROOT="/home/i/p/temp/module-federation-examples/dynamic-system-host"

# Start all applications in background using absolute paths
echo "Starting App1 (Host) on port 3001..."
(cd "$PROJECT_ROOT/app1" && pnpm start) &
APP1_PID=$!

echo "Starting App2 (Plugin) on port 3002..."
(cd "$PROJECT_ROOT/app2" && pnpm start) &
APP2_PID=$!

echo "Starting App3 (Plugin) on port 3003..."
(cd "$PROJECT_ROOT/app3" && pnpm start) &
APP3_PID=$!

echo "Starting App4 (Plugin) on port 3004..."
(cd "$PROJECT_ROOT/app4" && pnpm start) &
APP4_PID=$!

echo ""
echo "✅ All applications starting..."
echo "📱 Host App: http://localhost:3001"
echo "🔌 Plugin Apps: http://localhost:3002, http://localhost:3003, http://localhost:3004"
echo ""
echo "Process IDs: App1($APP1_PID), App2($APP2_PID), App3($APP3_PID), App4($APP4_PID)"
echo ""
echo "Press Ctrl+C to stop all applications"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping all applications..."
    kill $APP1_PID $APP2_PID $APP3_PID $APP4_PID 2>/dev/null || true
    pkill -f "webpack serve" || true
    echo "✅ All applications stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for all background processes
wait
