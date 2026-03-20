#!/bin/bash

# China Monitor — Start All Services

# Kill any existing processes
pkill -f "vite --" 2>/dev/null
pkill -f "node.*news-api" 2>/dev/null

echo "Starting China Monitor..."

# Start API server
cd /root/.openclaw/workspace/china-monitor/news-api
node src/server.js &
echo "News API started on port 3000"

# Start frontend
cd /root/.openclaw/workspace/china-monitor
npx vite --host 0.0.0.0 --port 7890
