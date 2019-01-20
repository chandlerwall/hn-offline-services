import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";

export async function frontPage(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  return {
    statusCode: 200,
    headers: {},
    body: "success",
  };
}
