#!/usr/bin/env bash

# Demo script for Dynamic Bidirectional Module Federation POC
# Safely kills previous processes and starts all services

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PID_FILE="$SCRIPT_DIR/demo.pid"

# Function to cleanup and kill processes
cleanup() {
    echo "🛑 Stopping all services..."
    
    # Kill processes from PID file if it exists
    if [ -f "$PID_FILE" ]; then
        while IFS= read -r pid; do
            if kill -0 "$pid" 2>/dev/null; then
                echo "Killing process $pid"
                kill "$pid" 2>/dev/null || true
            fi
        done < "$PID_FILE"
        rm -f "$PID_FILE"
    fi
    
    # Also kill any webpack/node processes on our ports
    pkill -f "webpack.*serve.*3001" 2>/dev/null || true
    pkill -f "webpack.*serve.*3002" 2>/dev/null || true
    pkill -f "node.*server.js" 2>/dev/null || true
    
    # Wait a moment for processes to stop
    sleep 2
    
    echo "✅ Cleanup complete"
}

# Trap to cleanup on script exit
trap cleanup EXIT INT TERM

# Cleanup any existing processes
cleanup

echo "🚀 Starting Dynamic Bidirectional Module Federation Demo..."
echo "===========================================" 

# Start host_backend (serves plugin configuration)
echo "Starting host_backend on port 3000..."
cd "$SCRIPT_DIR/host_backend"
if [ ! -d "node_modules" ]; then
    echo "Installing host_backend dependencies..."
    npm install
fi
node server.js &
BACKEND_PID=$!
echo $BACKEND_PID >> "$PID_FILE"
echo "✅ host_backend started (PID: $BACKEND_PID)"

# Start host_frontend 
echo "Starting host_frontend on port 3001..."
cd "$SCRIPT_DIR/host_frontend"
if [ ! -d "node_modules" ]; then
    echo "Installing host_frontend dependencies..."
    npm install
fi
npm start &
FRONTEND_PID=$!
echo $FRONTEND_PID >> "$PID_FILE"
echo "✅ host_frontend started (PID: $FRONTEND_PID)"

# Start plugin_frontend
echo "Starting plugin_frontend on port 3002..."
cd "$SCRIPT_DIR/plugin_frontend"
if [ ! -d "node_modules" ]; then
    echo "Installing plugin_frontend dependencies..."
    npm install
fi
npm start &
PLUGIN_PID=$!
echo $PLUGIN_PID >> "$PID_FILE"
echo "✅ plugin_frontend started (PID: $PLUGIN_PID)"

echo ""
echo "🎉 All services started successfully!"
echo "==========================================="
echo ""
echo "📋 Services:"
echo "  🔧 Backend:     http://localhost:3000"
echo "  🏠 Host:        http://localhost:3001"
echo "  🔌 Plugin:      http://localhost:3002"
echo ""
echo "🧪 Demo Instructions:"
echo "  1. Open http://localhost:3001 (Host application)"
echo "  2. Notice plugins automatically injected around the page"
echo "  3. Check sidebar for replaced content"
echo "  4. See bidirectional federation with host components"
echo "  5. Check http://localhost:3002 to see plugin running standalone"
echo ""
echo "⚡ Features demonstrated:"
echo "  ✅ Dynamic plugin loading from JSON config"
echo "  ✅ Automatic plugin injection (before/after/replace)"
echo "  ✅ Bidirectional module federation (plugins use host components)"
echo "  ✅ Hot reloading for development"
echo ""
echo "🛑 Press Ctrl+C to stop all services"
echo ""

# Wait for all background processes
wait
