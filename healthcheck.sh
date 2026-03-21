#!/bin/bash

# China Monitor Health Check Script
# Checks if services are responding, restarts if not

LOG_FILE="/root/.openclaw/workspace/china-monitor/healthcheck.log"
WORKSPACE="/root/.openclaw/workspace/china-monitor"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

# Check and restart Vite frontend (port 7890)
check_and_restart_frontend() {
  if ! lsof -i :7890 > /dev/null 2>&1; then
    log "Port 7890 not responding, restarting frontend..."
    pkill -f "vite --" 2>/dev/null
    sleep 2
    cd "$WORKSPACE"
    nohup npx vite --host 0.0.0.0 --port 7890 >> "$LOG_FILE" 2>&1 &
    log "Frontend restarted"
  else
    log "Frontend OK - port 7890"
  fi
}

# Check and restart News API (port 3100)
check_and_restart_news_api() {
  if ! lsof -i :3100 > /dev/null 2>&1; then
    log "Port 3100 not responding, restarting news API..."
    pkill -f "node.*news-api" 2>/dev/null
    pkill -f "node.*server.js" 2>/dev/null
    sleep 2
    cd "$WORKSPACE/news-api"
    nohup node src/server.js >> "$LOG_FILE" 2>&1 &
    log "News API restarted"
  else
    log "News API OK - port 3100"
  fi
}

# Check and restart Weather API (port 3101)
check_and_restart_weather_api() {
  if ! lsof -i :3101 > /dev/null 2>&1; then
    log "Port 3101 not responding, restarting weather API..."
    pkill -f "node.*weather" 2>/dev/null
    pkill -f "node.*api-server" 2>/dev/null
    sleep 2
    cd "$WORKSPACE/weather-nmc"
    nohup node src/api-server.js >> "$LOG_FILE" 2>&1 &
    log "Weather API restarted"
  else
    log "Weather API OK - port 3101"
  fi
}

# Run all checks
check_and_restart_frontend
check_and_restart_news_api
check_and_restart_weather_api

log "=== Health check completed ==="
