#!/bin/bash
set -e

echo "Running update content script..."

# Install backend dependencies
if [ -f "./backend/package.json" ]; then
    echo "Installing backend dependencies..."
    cd ./backend
    
    # Use npm ci if package-lock.json exists for faster and more reliable installs
    if [ -f "package-lock.json" ]; then
        npm ci
    else
        npm install
    fi
    
    cd ..
fi

# Install frontend dependencies
if [ -f "./frontend/package.json" ]; then
    echo "Installing frontend dependencies..."
    cd ./frontend
    
    # Use npm ci if package-lock.json exists for faster and more reliable installs
    if [ -f "package-lock.json" ]; then
        npm ci
    else
        npm install
    fi
    
    cd ..
fi

echo "Update content script completed." 