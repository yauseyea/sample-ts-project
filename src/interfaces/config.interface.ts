import { LogLevel } from 'bunyan';
import RotatingFileStream from 'bunyan-rotating-file-stream';

export interface Config {
   configName: string;
   appName: string;
   workspaceFolder: string;
   database: {
      // DB Connection setup
      host: string;
      port: number;
      user: string;
      password: string;
      database: string;
   };
   logging: {
      file: {
         // File logging config
         active: boolean;
         level: LogLevel;
         rotate: RotatingFileStream.options;
      };
      console: {
         // Console logging config
         level: LogLevel;
      };
      elasticsearch: {
         // Elasticsearch logging config
         active: boolean;
         level: LogLevel;
         host: string;
         port: string;
      };
   };
}
