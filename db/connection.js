import mongodb from "mongodb";

export class MongoConnection {
  client;

  connect(url) {
    return new Promise((resolve, reject) => {
      mongodb.MongoClient.connect(
        url,
        { useNewUrlParser: true, useUnifiedTopology: true },
        (error, client) => {
          if (error) {
            reject(error);
          } else {
            this.client = client;
            resolve(client);
          }
        }
      );
    });
  }
}
