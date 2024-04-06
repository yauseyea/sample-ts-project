import mysql, { Connection, QueryFunction } from 'mysql';
import { Config } from '../interfaces/config.interface';
import Logger from 'bunyan';

export default class DbConnection {
   static createDBconnection(config: Config, log: Logger): Promise<Connection> {
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

   /**
    * Executes a MySQL query
    * @param client MySQL Connection
    * @param query MySQL query string
    * @param log Logger for logging
    * @param debugOn optional, if set, than the response of the query will be printed on debug level
    * @returns MySQL response
    */
   static async executeQuery(
      client: Connection,
      query: string,
      log: Logger,
      debugOn = false
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
    * Executes a function in a MySQL transaction
    * If an error accures, the transaction is rolled back.
    * @param client MySQL Connection
    * @param log Logger for logging
    * @param callback function that should be executed in an transaction
    */
   static async executeFunctionInTransaction(
      client: Connection,
      log: Logger,
      callback: Function
   ): Promise<void> {
      await DbConnection.startTransaction(client, log);
      callback().catch(() => DbConnection.rollbackTransaction(client, log));
      await DbConnection.endTransaction(client, log);
   }
}
