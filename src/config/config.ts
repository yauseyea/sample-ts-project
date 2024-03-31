import { Config } from '../interfaces/config.interface';

import localConfig from './config.local';
import devConfig from './config.dev';
import prodConfig from './config.prod';

let config: Config; 

if (process.env.ENVIREMENT === 'local') {
    config = localConfig;
} else if (process.env.ENVIREMENT === 'dev') {
    config = devConfig;
} else if (process.env.ENVIREMENT === 'prod') {
    config = prodConfig;
} else {
    config = localConfig;
    console.debug(`No config found, using ${config.configName} instaed`);
}
console.debug(`Loading Config: ${config.configName}`);

export = config;