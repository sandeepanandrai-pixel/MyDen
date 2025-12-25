#!/bin/sh
# Custom build script to work around react-scripts permission issues

echo "Starting custom build process..."

# Make node_modules executable
chmod -R +x node_modules/.bin 2>/dev/null || true

# Try multiple build methods
if [ -x "node_modules/.bin/react-scripts" ]; then
  echo "Using react-scripts directly..."
  node_modules/.bin/react-scripts build
elif command -v npx > /dev/null; then
  echo "Using npx..."
  npx --yes react-scripts build
else
  echo "Using node directly..."
  node node_modules/react-scripts/bin/react-scripts.js build
fi

echo "Build completed!"
