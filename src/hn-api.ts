import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import firebase from "firebase/app";
import "firebase/database";
import App = firebase.app.App;
import Database = firebase.database.Database;
import DataSnapshot = firebase.database.DataSnapshot;

const API_URL = "https://hacker-news.firebaseio.com";
const API_VERSION = "/v0";

export async function hn(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  console.log(event);

  const id = event.pathParameters["id"];

  let app: App;
  let data: any;

  try {
    // TODO - Look for an existing Firebase application before creating a new one.
    app = firebase.initializeApp({databaseURL: API_URL});
    const db: Database = app.database();
    const path = `item/${id}`;
    const item = db.ref(API_VERSION).child(path);
    const snapshot: DataSnapshot = await item.once("value");
    data = snapshot.val();
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
    body: JSON.stringify(data),
  };
}
