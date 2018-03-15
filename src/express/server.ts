import * as express from 'express';
import { MongoClient, Db } from 'mongodb';

export class App {

  private express: express.Application;

  private _mongoClient: MongoClient;
  private _db: Db;

  // Run configuration methods on the Express instance.
  constructor() {
    this.express = express();
    // this.middleware();
    this.routes();

    // database
    this._connectMongoDB();

  }

  public listen(port?: number) {
    this.express.listen(port ? port : 8000);
  }
  public exit() {
    console.log('Closing DB Connection');
    this._mongoClient.close();
  }

  private _connectMongoDB() {
    // TODO: create config file or use enviroment vars
    const url = 'mongodb://localhost';
    const port = '27017';
    const dbName = 'test';
    const mongodbConnectionString = url + ':' + port;
    MongoClient.connect(mongodbConnectionString, (error, mongoClient) => {
      if (error) {
        throw new Error('DB Connection error');
      }
      console.log('Connected successfully to MongoDB Server');
      this._mongoClient = mongoClient;

      this._db = mongoClient.db(dbName);
      this._db.collection('test');


    });

  }

  // Configure API endpoints.
  private routes(): void {
    /* This is just to get up and running, and to make sure what we've got is
       * working so far. This function will change when we start to add more
       * API endpoints */
    let router = express.Router();
    // placeholder route handler
    router.get(
      '/',
      (
        _req: express.Request,
        res: express.Response,
        _next: express.NextFunction
      ) => {
        res.json({
          message: 'Hello World!'
        });
      }
    );
    this.express.use('/api', router);
  }
  // serve static
  // this.express.use(express.static(__dirname + '/dist'))
}
