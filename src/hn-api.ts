import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import firebase from "firebase/app";
import "firebase/database";
import App = firebase.app.App;
import Database = firebase.database.Database;
import DataSnapshot = firebase.database.DataSnapshot;

const API_URL = "https://hacker-news.firebaseio.com";
const API_VERSION = "/v0";

export async function hn(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  let id;
  // TODO - Create helper/wrapper method to simplify try-catch interactions.
  try {
    id = event.pathParameters.id;

    // TODO - Include helper method to validate path parameters.
    if (id == null) {
      console.error("Missing path parameter: id");

      // TODO - Create helper method to return consistent responses for various scenarios.
      return {
        statusCode: 400,
        headers: {},
        body: JSON.stringify({
          status: "Error",
          message: "Missing path parameter: id",
        }),
      };
    }
  } catch (error) {
    console.error(error);
    // TODO - Create helper method to return consistent responses for various scenarios.
    return {
      statusCode: 400,
      headers: {},
      body: JSON.stringify({
        status: "Error",
        message: "Unknown error processing path parameters.",
      }),
    };
  }

  let app: App;
  let data: any;

  try {
    // TODO - Look for an existing Firebase application before creating a new one.
    app = firebase.initializeApp({databaseURL: API_URL});
    data = await fetchItemById(app, id);
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

async function fetchItemById(firebaseApp: App, id: any) {
  const db: Database = firebaseApp.database();
  const path = `item/${id}`;
  const itemReference = db.ref(API_VERSION).child(path);
  console.log(`Start fetching ${id}`);
  const itemSnapshot: DataSnapshot = await itemReference.once("value");
  // TODO - Check if the requested reference exists. Return 404 if the requested item does not exist.
  // TODO - Create a type declaration for an item.
  const item = itemSnapshot.val();
  console.log(`Finish fetching ${id}`);

  let comments: object[] = [];
  if (item && item.kids && item.kids.length) {
    comments = await Promise.all(item.kids.map((kid: any) => {
      console.log(`Prepare to fetch kid ${kid}`);
      // TODO - Is there a better way than recursion?
      const kidItem = fetchItemById(firebaseApp, kid);
      console.log(`Finish fetching kid ${kid}`);
      return kidItem;
    }));
  }

  return {
    item,
    comments,
  };
}
