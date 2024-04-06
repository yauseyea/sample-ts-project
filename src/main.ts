import config from './config/config';
import getLog from './monitoring/logging';
import DbConnection from './database/db-interface';
import Logger from 'bunyan';

async function start(): Promise<void> {
   const log: Logger = getLog(config);

   log.info(`${config.configName} config loaded`);
   log.debug('adding a log only in console');
   log.warn('adding a warning to elasticsearch');

   const query: string = 'SELECT * FROM sys.user_summary;';
   const client = await DbConnection.createDBconnection(config, log);
   await DbConnection.executeQuery(client, query, log)
      .then(() => {
         log.info('MySQL setted up correctly');
      })
      .catch((error) => log.error(error));

   await DbConnection.executeFunctionInTransaction(client, log, () =>
      DbConnection.executeQuery(client, query, log).then(() => {
         log.info('Transactions working');
      })
   ).catch((error) => log.error(error));

   client.end();
   return;
}

start().then(async () => {
   // need to close or the programm will keep running because of the elasticsearch connection
   try {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // let's wait before the programm closes
      process.exit(0);
   } catch (error) {
      console.error(error);
      process.exit(1);
   }
});
