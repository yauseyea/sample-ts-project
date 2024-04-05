import mysql, { Connection, QueryFunction } from 'mysql';
import { Config } from '../interfaces/config.interface';
import Logger from 'bunyan';

export default class DbConnection {
   private static createDBconnection(
      config: Config,
      log: Logger
   ): Promise<Connection> {
      return new Promise((resolve, reject) => {
         try {
            const client: Connection = mysql.createConnection({
               host: config.database.host,
               port: config.database.port,
               user: config.database.user,
               password: config.database.password,
               database: config.database.database,
            });
            client.connect((error) => {
               if (error) {
                  log.error('Could not connect to the database');
                  reject(error);
               } else {
                  resolve(client);
               }
            });
         } catch (error) {
            log.error('Could not connect to the database');
            reject(error);
         }
      });
   }

   private static async executeQuery(
      client: Connection,
      query: string,
      log: Logger,
      debugOn = true
   ): Promise<QueryFunction> {
      return new Promise((resolve, reject) => {
         client.query(query, (err, rows) => {
            if (err) {
               reject(err);
               log.error(`MySQL query: ${query} has thrown errors`);
            }
            if (debugOn) {
               log.debug(rows);
            }
            resolve(rows);
         });
      });
   }

   private static async startTransaction(
      client: Connection,
      log: Logger
   ): Promise<QueryFunction> {
      return new Promise((resolve, reject) => {
         const query = 'START TRANSACTION;';
         DbConnection.executeQuery(client, query, log, false)
            .then((result) => resolve(result))
            .catch((err) => reject(err));
      });
   }

   private static async endTransaction(
      client: Connection,
      log: Logger
   ): Promise<QueryFunction> {
      return new Promise((resolve, reject) => {
         const query = 'COMMIT;';
         DbConnection.executeQuery(client, query, log, false)
            .then((result) => resolve(result))
            .catch((err) => reject(err));
      });
   }

   private static async rollbackTransaction(
      client: Connection,
      log: Logger
   ): Promise<QueryFunction> {
      return new Promise((resolve, reject) => {
         const query = 'ROLLBACK;';
         DbConnection.executeQuery(client, query, log, false)
            .then((result) => resolve(result))
            .catch((err) => reject(err));
      });
   }

   /**
    * Creates a connection to MySQL.
    * If successfull, starts a MySQL query in a transaction.
    * If the transaction has an error, everything is rolled back.
    * @param config Config of the application
    * @param query MySQL querry as a string
    * @param log Logger for logging
    * @param debugOn optional, if set, than the response of the query will be printed on debug level
    * @returns MySQL response
    */
   static async executeQueryInTransaction(
      config: Config,
      query: string,
      log: Logger,
      debugOn = false
   ): Promise<QueryFunction> {
      const client: Connection = await DbConnection.createDBconnection(
         config,
         log
      );
      await DbConnection.startTransaction(client, log);
      return new Promise((resolve, reject) => {
         DbConnection.executeQuery(client, query, log, debugOn)
            .then(async (resp) => {
               await DbConnection.endTransaction(client, log);
               client.end();
               resolve(resp);
            })
            .catch(async (err) => {
               await DbConnection.rollbackTransaction(client, log);
               await DbConnection.endTransaction(client, log);
               client.end();
               reject(err);
            });
      });
   }
}
