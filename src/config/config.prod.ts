import { Config } from '../interfaces/config.interface';
import ConfigUtils from './config-utils';

const prodConfig: Config = {
   configName: 'Production',
   appName: 'sample-ts-project-prod',
   workspaceFolder: ConfigUtils.getworkSpaceDir(),
   database: {
      host: ConfigUtils.envVarOrError('DB_HOST'),
      port: Number.parseInt(ConfigUtils.envVarOrError('DB_PORT')),
      user: ConfigUtils.envVarOrError('DB_USER'),
      password: ConfigUtils.envVarOrError('DB_PASSWORD'),
      database: ConfigUtils.envVarOrError('DB_SCHEMA'),
   },
   logging: {
      file: {
         active: false,
         level: 'info',
         rotate: {
            period: '1d',
            totalFiles: 90,
            rotateExisting: true,
            startNewFile: true,
            threshold: '16m',
            totalSize: '1024m',
            gzip: true,
            path: `${ConfigUtils.getworkSpaceDir()}/logs/sample-ts-project-local.%Y-%m-%d.log`,
         },
      },
      console: {
         level: 'debug',
      },
      elasticsearch: {
         active: true,
         level: 'warn',
         host: ConfigUtils.envVarOrError('ELASTICSEARCH_HOST'),
         port: ConfigUtils.envVarOrError('ELASTICSEARCH_PORT'),
      },
   },
};

export = prodConfig;
