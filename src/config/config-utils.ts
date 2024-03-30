export default class ConfigUtils {
    static envVarOrError(val: string) {
        const variable = process.env[val];
        if (variable) {
            return variable;
        }
        throw new Error(`Env var ${val} not set`)
    }
}