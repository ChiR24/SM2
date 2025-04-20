#!/bin/bash
set -e

echo "Running post-start script..."

# Start MongoDB service
sudo service mongod start || echo "Failed to start MongoDB service"

echo "Post-start script completed." 