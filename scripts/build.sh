#!/bin/sh

start_time=$(date +%s)
echo "start build zip"
pwd 
echo "1. If not exist docker build image"
docker image inspect lambda-zipper >/dev/null 2>&1 || docker build . -t lambda-zipper:latest

echo "2. Tsc build to dist/index.js and copy package.json to dist"
cd ../ && pnpm exec tsc && cp package.json dist/package.json

echo "3. Run image with volume - will install node modules relative to docker container, and then zip it"
docker run --rm -v /$(pwd)/dist:/dist lambda-zipper

echo "4. extract lambda-function.zip from dist/ and remove dist folder"
cp dist/lambda-function.zip lambda-function.zip && rm -rf dist
end_time=$(date +%s)

# Calculate the duration
duration=$((end_time - start_time))

echo "Complete Time: $duration seconds. File created dist/lambda-function.zip"
# approx 162 seconds. Slow becaues its mounted - 2 1/2 minutes!!