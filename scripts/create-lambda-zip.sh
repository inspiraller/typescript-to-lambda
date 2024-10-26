#!/bin/sh
cd dist 
echo "npm install..."
npm install --omit=dev

echo "Zipping..."
ls 

zip -r lambda-function.zip ./* -x "*.git*" "*.DS_Store*" >/dev/null 2>&1 && echo "Zip created." || echo "Zip creation failed."


