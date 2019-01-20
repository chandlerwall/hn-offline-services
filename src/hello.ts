import {APIGatewayProxyHandler} from "aws-lambda";

export const hello: APIGatewayProxyHandler = async (event, context) => {
  // TODO - This function needs to be come a health check.
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!",
      input: event,
      context,
    }),
  };
};
