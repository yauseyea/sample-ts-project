import ConfigUtils from '../config/config-utils';

beforeAll(() => {
    process.env.ENVIREMENT = 'local';
});

describe('Tests the config utils', () => {
    it('should throw an error if an environment variable is not set correctly', () => {
        const notSetAnEnvVar = 'notSetAnEnvVar';
        expect(() => ConfigUtils.envVarOrError(notSetAnEnvVar)).toThrow(Error);
    });

    it('should display the value of an existing env var', () => {
        const existingVariable = 'EXISTING_VARIABLE';
        const envVarValue = 'set'
        process.env[existingVariable] = envVarValue;
        expect(ConfigUtils.envVarOrError(existingVariable)).toBe(envVarValue);
    });

});

describe('Tests if the config are correctly loaded', () => {
    const env: string[] = ['local', 'dev', 'prod', 'unknown']
    let i: number = 0;
    beforeEach(() => {
        process.env.ENVIREMENT = env[i]; 
        jest.resetModules()
        i++;
    });

    it('should load local config when ENVIRONMENT is set to "local"', () => {
        const localConfig = require('../config/config.local');
        const config = require('../config/config');
        expect(config).toEqual(localConfig);
    });

    it('should load dev config when ENVIRONMENT is set to "dev"', () => {
        const devConfig = require('../config/config.dev');
        const config = require('../config/config');
        expect(config).toEqual(devConfig);
    });

    it('should load prod config when ENVIRONMENT is set to "prod"', () => {
        const prodConfig = require('../config/config.prod');
        const config = require('../config/config');
        expect(config).toEqual(prodConfig);
    });

    it('should load local config when ENVIRONMENT is not set to any known value', () => {
        const localConfig = require('../config/config.local');
        const config = require('../config/config');
        expect(config).toEqual(localConfig);
    });
});