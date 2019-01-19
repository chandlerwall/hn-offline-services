import {APIGatewayProxyResult} from "aws-lambda";
import firebase from "firebase/app";
import "firebase/database";
import DataSnapshot = firebase.database.DataSnapshot;

const API_URL = "https://hacker-news.firebaseio.com";
const API_VERSION = "/v0";

export async function hn(): Promise<APIGatewayProxyResult> {
    const app = firebase.initializeApp({databaseURL: API_URL});
    const db = app.database().ref(API_VERSION);
    // console.dir(db);
    const path = "item/8863";
    // const promise = new Promise(
    //     (resolve: (value: any) => void, reject: (reason: any) => void): void => {
    //         db.child(path).once(
    //             "value",
    //             (snapshot: DataSnapshot) => {
    //                 resolve(snapshot.val());
    //             },
    //             reject
    //         );
    //     }
    // );
    const item = db.child(path);
    // console.dir(item);
    const snapshot = await item.once("value");
    // console.dir(snapshot.exists());
    // const data = snapshot.val();
    // app.delete();
    const data = snapshot.val();
    return {
        statusCode: 200,
        body: JSON.stringify({
            here: "in here",
            data: data,
        }),
    };
}
