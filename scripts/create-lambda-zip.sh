#!/bin/sh
cd dist
# Depends on volume  -v "$(pwd):/lambda" \
pwd
echo "1 of 4 - clear lambda-function.zip"
rm -rf lambda-function.zip

echo "2 of 4 - Installing Node.js dependencies..."
ls 
npm install --omit=dev

# npm exec tsc
echo "3 of 4 - Zipping project files..."
ls 
zip -r lambda-function.zip . -x "*.git*" "*.DS_Store*" >/dev/null 2>&1 && echo "Zip created." || echo "Zip creation failed."

echo "4 of 4 - Remove node_modules"
rm -rf node_modules package-lock.json

echo "complete. Expect dist/lambda-function.zip exists!"
