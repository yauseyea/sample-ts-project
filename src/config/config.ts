import { Config } from '../interfaces/config.interface';

import localConfig from './config.local';
import devConfig from './config.dev';
import prodConfig from './config.prod';

let config: Config; 

if (process.env.ENVIROMENT === 'local') {
    config = localConfig;
} else if (process.env.ENVIROMENT === 'dev') {
    config = devConfig;
} else if (process.env.ENVIROMENT === 'prod') {
    config = prodConfig;
} else {
    config = localConfig;
    console.error(`No config found, using ${config.configName} instaed`);
    throw new Error('No config loaded');
}
console.debug(`Loading Config: ${config.configName}`);

export = config;