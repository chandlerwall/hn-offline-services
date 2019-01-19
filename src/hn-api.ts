import {APIGatewayProxyResult} from "aws-lambda";
import firebase from "firebase/app";
import "firebase/database";
import DataSnapshot = firebase.database.DataSnapshot;

const API_URL = "https://hacker-news.firebaseio.com";
const API_VERSION = "/v0";

export async function hn(): Promise<APIGatewayProxyResult> {
    console.log("starting");
    const app = firebase.initializeApp({databaseURL: API_URL});
    const db = app.database().ref(API_VERSION);
    // console.dir(db);
    const path = "item/192327";
    // const promise = new Promise(
    //     (resolve: (value: any) => void, reject: (reason: any) => void): void => {
    //         db.child(path).once(
    //             "value",
    //             (snapshot: DataSnapshot) => {
    //                 console.log(snapshot);
    //                 resolve(snapshot.val());
    //             },
    //             reject
    //         );
    //     }
    // );
    const item = db.child(path);
    // console.dir(item);
    console.log("fetching");
    const snapshot = await item.once("value");
    // console.dir(snapshot.exists());
    const data = snapshot.val();
    console.dir(data);
    await app.delete();
    return {
        statusCode: 200,
        body: JSON.stringify({
            here: "in here",
            data: data,
        }),
    };
}
