#Rest API 
In this example, I will show how to create a REST API with lambda based architecture by endpoint. We will also show the use of sqs, which activate a lambda when receiving a msg.

## Features
- API KEY
- SQS
- Serverless Resources (DynamoDB table)
- Connection with DynamoDB
- iamRoleStatement

## Commands
### Deploy
- npm install
- sls deploy
- ### API Invocation
- We have to trigger the lambda throught the API Gateway, so, after the firts deploy you will recive an URL like this https://XXXXX.execute-api.us-east-1.amazonaws.com/dev/{proxy+}. Try your first request with https://XXXXX.execute-api.us-east-1.amazonaws.com/dev/pedido