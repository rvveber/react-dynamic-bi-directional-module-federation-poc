#!/usr/bin/env bash

# React Dynamic Bi-directional Module Federation POC Demo
# Demonstrates static site generation with runtime module federation

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PID_FILE="$SCRIPT_DIR/demo.pid"

# Cleanup function to stop all services
cleanup() {
    if [ -f "$PID_FILE" ]; then
        echo "🛑 Stopping previous services..."
        while IFS= read -r pid; do
            if kill -0 "$pid" 2>/dev/null; then
                echo "Killing process $pid"
                kill "$pid" 2>/dev/null || true
            fi
        done < "$PID_FILE"
        rm -f "$PID_FILE"
        echo "✅ Cleanup complete"
    fi
}

# Setup signal handlers
trap cleanup EXIT INT TERM

# Clean up any existing processes
cleanup

echo "🚀 Starting Module Federation Demo..."
echo "======================================="

# Build and serve host frontend (Next.js SSG with Module Federation)
echo "🏗️ Building host application..."
cd "$SCRIPT_DIR/host_frontend"
if [ ! -d "node_modules" ]; then
    echo "Installing host dependencies..."
    npm install
fi

echo "Building static host with module federation..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Host build failed"
    exit 1
fi

echo "Starting host server on port 3001..."
./node_modules/.bin/serve out -l 3001 &
HOST_PID=$!
echo $HOST_PID >> "$PID_FILE"
echo "✅ Host frontend started (PID: $HOST_PID)"

# Build and serve plugin frontend (Webpack with Module Federation)
echo "🔌 Building plugin application..."
cd "$SCRIPT_DIR/plugin_frontend"
if [ ! -d "node_modules" ]; then
    echo "Installing plugin dependencies..."
    npm install
fi

echo "Building webpack plugin with module federation..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Plugin build failed"
    exit 1
fi

echo "Starting plugin server on port 3002..."
./node_modules/.bin/serve dist -l 3002 &
PLUGIN_PID=$!
echo $PLUGIN_PID >> "$PID_FILE"
echo "✅ Plugin frontend started (PID: $PLUGIN_PID)"

echo ""
echo "🎉 Module Federation Demo Ready!"
echo "================================"
echo ""
echo "📋 Services:"
echo "  🏠 Host:          http://localhost:3001 (Next.js SSG + Module Federation)"
echo "  🔌 Plugin:        http://localhost:3002 (Webpack + Module Federation)"
echo ""
echo "🧪 Demo Instructions:"
echo "  1. Open http://localhost:3001"
echo "  2. Wait for 5-second countdown"
echo "  3. Watch plugins auto-inject into designated positions"
echo "  4. Test bidirectional federation (host ↔ plugin interaction)"
echo ""
echo "⚡ Features Demonstrated:"
echo "  ✅ Static Site Generation with runtime Module Federation"
echo "  ✅ Dynamic plugin loading from JSON configuration"
echo "  ✅ Bidirectional component sharing (host ↔ plugin)"
echo "  ✅ Shared state management across federated apps"
echo "  ✅ DOM-based plugin injection with positioning control"
echo ""
echo "🛑 Press Ctrl+C to stop all services"
echo ""

# Wait for all background processes
wait
