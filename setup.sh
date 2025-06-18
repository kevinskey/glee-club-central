#!/usr/bin/env bash
# Setup script for local development

# Exit immediately if a command exits with a non-zero status
set -e

# Ensure npm is installed
if ! command -v npm >/dev/null 2>&1; then
  echo "Error: npm is not installed. Please install Node.js and npm." >&2
  exit 1
fi

# Install project dependencies
if [ -f package-lock.json ]; then
  npm ci
else
  npm install
fi

# Create .env if it does not exist
if [ -f .env.example ] && [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env from .env.example. Update the file with your values." >&2
fi

echo "Setup complete."
