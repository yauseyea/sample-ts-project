import bunyan, { LoggerOptions, Stream } from 'bunyan';
import RotatingFileStream from 'bunyan-rotating-file-stream';
import { Config } from '../interfaces/config.interface';
import { Writable } from 'stream';
import { BunyanESStream } from 'bunyan-elasticsearch-stream';

export default (config: Config) => {
   class RawLogStream {
      write(rec: Record) {
         console.log(
            rec.time.toISOString(),
            bunyan.nameFromLevel[rec.level],
            rec.component ? rec.component : 'Main',
            rec.msg
         );
      }
   }

   // Creates 3 Streams for logging, console/local log file/upload to elasticsearch
   const streams: Stream[] = [
      {
         // console logging is always active
         level: config.logging.console.level,
         stream: new RawLogStream() as Writable,
         type: 'raw',
      },
   ];

   // Local log files
   if (config.logging.file.active) {
      const rotatingFileStreamConfig: RotatingFileStream.options = {
         period: config.logging.file.rotate.period,
         totalFiles: config.logging.file.rotate.totalFiles,
         rotateExisting: config.logging.file.rotate.rotateExisting,
         startNewFile: config.logging.file.rotate.startNewFile,
         threshold: config.logging.file.rotate.threshold,
         totalSize: config.logging.file.rotate.totalSize,
         gzip: config.logging.file.rotate.gzip,
         path: config.logging.file.rotate.path,
      };
      const rotatingFileStream: RotatingFileStream = new RotatingFileStream(
         rotatingFileStreamConfig
      );
      streams.push({
         level: config.logging.file.level,
         stream: rotatingFileStream as NodeJS.WriteStream,
      });
   }

   // Elasticsearch logging
   if (config.logging.elasticsearch.active) {
      streams.push({
         level: config.logging.elasticsearch.level,
         stream: new BunyanESStream({
            indexName: config.appName,
            limit: 1,
            clientOptions: {
               node: `${config.logging.elasticsearch.host}:${config.logging.elasticsearch.port}`,
            },
         }),
      });
   }

   const loggerOptions: LoggerOptions = {
      name: config.configName,
      src: true,
      streams,
   };

   return bunyan.createLogger(loggerOptions);
};

interface Record {
   time: Date;
   level: number;
   component: string;
   msg: string;
}
