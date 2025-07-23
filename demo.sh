#!/usr/bin/env bash

# Demo script for SSG + Module Federation POC
# Host: Next.js SSG with manual remoteEntry.js copy
# Plugin: Standard webpack with proper remoteEntry.js

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PID_FILE="$SCRIPT_DIR/demo.pid"

# Function to cleanup and kill processes
cleanup() {
    echo "🛑 Stopping all SSG + Module Federation services..."
    
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
    
    # Also kill any serve processes on our ports
    pkill -f "serve.*3001" 2>/dev/null || true
    pkill -f "serve.*3002" 2>/dev/null || true
    pkill -f "node.*server.js" 2>/dev/null || true
    
    # Wait a moment for processes to stop
    sleep 2
    
    echo "✅ Cleanup complete"
}

# Trap to cleanup on script exit
trap cleanup EXIT INT TERM

# Cleanup any existing processes
cleanup

echo "🚀 Starting SSG + Module Federation Demo..."
echo "================================================================"

# Build and serve host_frontend (Next.js SSG with manual remoteEntry.js copy)
echo "🏗️ Building host SSG application..."
cd "$SCRIPT_DIR/host_frontend"
if [ ! -d "node_modules" ]; then
    echo "Installing host_frontend dependencies..."
    bun install
fi

echo "Building static host with federation..."
bun run build
if [ $? -ne 0 ]; then
    echo "❌ Host build failed"
    exit 1
fi

echo "Starting host SSG server on port 3001..."
./node_modules/.bin/serve out -l 3001 &
HOST_PID=$!
echo $HOST_PID >> "$PID_FILE"
echo "✅ host_frontend started (PID: $HOST_PID)"

# Build and serve plugin_frontend (standard webpack)
echo "🔌 Building plugin webpack application..."
cd "$SCRIPT_DIR/plugin_frontend"
if [ ! -d "node_modules" ]; then
    echo "Installing plugin_frontend dependencies..."
    bun install
fi

echo "Building webpack plugin with proper remoteEntry.js..."
bun run build
if [ $? -ne 0 ]; then
    echo "❌ Plugin build failed"
    exit 1
fi

echo "Starting plugin server on port 3002 (remoteEntry.js only)..."
./node_modules/.bin/serve dist -l 3002 &
PLUGIN_PID=$!
echo $PLUGIN_PID >> "$PID_FILE"
echo "✅ plugin_frontend started (PID: $PLUGIN_PID)"

# Start host_backend (still needed for plugin configuration)
echo "🔧 Starting configuration backend..."
cd "$SCRIPT_DIR/host_backend"
if [ ! -d "node_modules" ]; then
    echo "Installing host_backend dependencies..."
    bun install
fi
node server.js &
BACKEND_PID=$!
echo $BACKEND_PID >> "$PID_FILE"
echo "✅ host_backend started (PID: $BACKEND_PID)"

echo ""
echo "🎉 All SSG + Module Federation services started successfully!"
echo "=================================================="
echo ""
echo "📋 Services:"
echo "  🔧 Backend:       http://localhost:3000 (plugins.json)"
echo "  🏠 Host:          http://localhost:3001 (Next.js with module federation)"
echo "  🔌 Plugin:        http://localhost:3002 (webpack remoteEntry.js)"
echo ""
echo "🧪 Module Federation Demo Instructions:"
echo "  1. Open http://localhost:3001 (Host Application)"
echo "  2. Wait for countdown - plugins auto-inject from webpack build"
echo "  3. See bidirectional federation between host ↔ plugin"
echo ""
echo "⚡ Module Federation Features demonstrated:"
echo "  ✅ Host: Next.js SSG static build with module federation"
echo "  ✅ Plugin: Webpack build exposing components to host"
echo "  ✅ Runtime Module Federation from static ↔ webpack builds"
echo "  ✅ Dynamic plugin loading from webpack federation"
echo "  ✅ Bidirectional component sharing (host ↔ plugin)"
echo ""
echo "🏗️ Build artifacts:"
echo "  📁 host_frontend/out/       - Static host files + copied remoteEntry.js"
echo "  📁 plugin_frontend/dist/    - Webpack plugin files + native remoteEntry.js"
echo ""
echo "🛑 Press Ctrl+C to stop all services"
echo ""

# Wait for all background processes
wait
