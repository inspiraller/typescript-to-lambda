# How to create a nodejs lambda with typescript
This example shows how to create a nodejs lambda with typescript and zip it ready for uploading to aws lambda.

# WARNING!
Do not use. Use latest tag
This uses Docker volume and shares it to the host.
It is too slow. 230 seconds.
We can improve that

# How it works
This uses Docker to load up an amazon image, then node to install relative to that image, and zip it.
It uses a mounted volume to the host which shares the output. 
NOTE: This is stupidly slow. Just tagged for reference!


# Prerequisites
- nodejs
- pnpm 
- docker
- git bash

# Steps
1. Clone this repo
2. Run `pnpm install`
3. Run `pnpm build`
4. Creates: lambda-function.zip


# Example bash script to upload this lambda to typescript
- Note you will have to have created the lambda role, and any action permission
```sh
#!/bin/sh
ACCOUNT_ID=$(aws sts get-caller-identity --query "Account" --output text)
LAMBDA_FUNCTION="lambda-typescript-example"
LAMBDA_ROLE_ARN="arn:aws:iam::${ACCOUNT_ID}:role/${LAMBDA_FUNCTION}"
aws lambda create-function \
    --function-name $LAMBDA_FUNCTION \
    --zip-file fileb://lambda-function.zip \
    --handler "index.handler" \
    --runtime nodejs18.x \
    --role $LAMBDA_ROLE_ARN \
    --query "FunctionArn"
```

----
# Key points

## package.json
These are the files that the lambda needs to run
```json
  "main": "index.js",
  "files": [
    "index.js",
    "package.json",
    "node_modules/"
  ]
```

## tsconfig.json
- removes the gunk from the output
```json
    "target": "ES2018",
    "module":"ES6",
```
- add additional files here to the output as desired
  "include": ["src/*"],
 
- Do not set this, otherwise it won't emit anything
    // "noEmit": true,


## scripts/build.sh
- This runs a series of steps to complete the build

## scripts/create-lambda-zip.sh
- This zips the contents of index.js, package.js and node_modules
The reason this is kept outside of the Docker image is so that you can edit it as desired without having to build the image
