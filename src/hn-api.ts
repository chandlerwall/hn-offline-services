import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import firebase from "firebase/app";
import "firebase/database";
import App = firebase.app.App;
import Database = firebase.database.Database;
import DataSnapshot = firebase.database.DataSnapshot;

export const API_URL = "https://hacker-news.firebaseio.com";
export const API_VERSION = "/v0";

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
    data = await fetchItemById(app, `item/${id}`);
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

export async function fetchItemById(firebaseApp: App, path: any) {
  // TODO - Move this function into a shared location.
  // TODO - Improve logging to include meaningful, diagnostic information.
  const db: Database = firebaseApp.database();
  const itemReference = db.ref(API_VERSION).child(path);
  // console.log(`Start fetching ${path}`);
  const itemSnapshot: DataSnapshot = await itemReference.once("value");
  // TODO - Check if the requested reference exists. Return 404 if the requested item does not exist.
  // TODO - Create a type declaration for an item.
  const item = itemSnapshot.val();
  // console.log(`Finish fetching ${path}`);

  let comments: object[] = [];
  if (item && item.kids && item.kids.length) {
    comments = await Promise.all(item.kids.map((kid: any) => {
      // console.log(`Prepare to fetch kid ${kid}`);
      // TODO - Is there a better way than recursion?
      const kidItem = fetchItemById(firebaseApp, `item/${kid}`);
      // console.log(`Finish fetching kid ${kid}`);
      return kidItem;
    }));
  }

  return {
    item,
    comments,
  };
}
