# How to create a nodejs lambda with typescript
This example shows how to create a nodejs lambda with typescript and zip it ready for uploading to aws lambda.

Simply clone this repo and change accordingly.
This uses pnpm but you can use nodejs. Just change the references in package.json to npm instead of pnpm.

# Prerequisites
- nodejs
- pnpm 

# Steps
1. Clone this repo
2. Run `pnpm install`
3. Run `pnpm build`
4. do what you will with the generated: package-typescript-lambda-1.0.0.tgz


# Example bash script to upload this lambda to typescript
- Note you will have to have created the lambda role, and any action permission
```sh
#!/bin/sh
ACCOUNT_ID=$(aws sts get-caller-identity --query "Account" --output text)
LAMBDA_FUNCTION="lambda-typescript-example"
LAMBDA_ROLE_ARN="arn:aws:iam::${ACCOUNT_ID}:role/${LAMBDA_FUNCTION}"
aws lambda create-function \
    --function-name $LAMBDA_FUNCTION \
    --zip-file fileb://package-typescript-lambda-1.0.0.zip \
    --handler "index.handler" \
    --runtime nodejs18.x \
    --role $LAMBDA_ROLE_ARN \
    --query "FunctionArn"
```

----
# Key points
## package.json
These are the dependencies that will be in the node_modules folder
- script *pnpm pack* needs tese declared
```json
  "bundledDependencies": [
    "@aws-sdk/client-ecs",
    "@aws-sdk/client-ssm",
    "@aws-sdk/client-ec2"
  ],
```
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

## "build:step2
- tsc will output the typescript to javascript.

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


