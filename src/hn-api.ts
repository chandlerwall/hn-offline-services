import {APIGatewayProxyResult} from "aws-lambda";
import firebase from "firebase/app";
import "firebase/database";
import App = firebase.app.App;
import DataSnapshot = firebase.database.DataSnapshot;
import Reference = firebase.database.Reference;

const API_URL = "https://hacker-news.firebaseio.com";
const API_VERSION = "/v0";

export async function hn(): Promise<APIGatewayProxyResult> {
  let app: App;
  let data: any;

  try {
    // TODO - Look for an existing Firebase application before creating a new one.
    app = firebase.initializeApp({databaseURL: API_URL});
    const db: Reference = app.database().ref(API_VERSION);
    const path = "item/192327";
    const item = db.child(path);
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
    body: JSON.stringify(data),
  };
}
