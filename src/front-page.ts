import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import firebase from "firebase";
import {API_URL, fetchItemById} from "./hn-api";
import App = firebase.app.App;

export async function frontPage(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  let app: App;
  let items: any;

  try {
    // TODO - Look for an existing Firebase application before creating a new one.
    app = firebase.initializeApp({databaseURL: API_URL});
    const data = await fetchItemById(app, "topstories");
    items = await Promise.all(data.item.slice(0, 30).map((itemId: any) => fetchItemById(app, `item/${itemId}`)));
  } catch (error) {
    console.error(error);
  } finally {
    if (app) {
      // TODO - Identify a more appropriate way to manage Firebase resources/applications.
      await app.delete();
    }
  }

  return {
    statusCode: 200,
    headers: {},
    body: JSON.stringify(items),
  };
}
