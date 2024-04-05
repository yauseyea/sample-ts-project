import path from 'path';

export default class ConfigUtils {
   /**
    * Checks existence of a specific Env var.
    * If not existent, throws an error
    * @param val Name of Env var
    * @returns Value of env var
    */
   static envVarOrError(val: string): string {
      const variable = process.env[val];
      if (variable) {
         return variable;
      }
      throw new Error(`Env var ${val} not set`);
   }

   /**
    * Gets the path string of the local project dir
    * @returns path string of the local project dir
    */
   static getworkSpaceDir(): string {
      const curFolder: string = path.resolve(__dirname);
      const folders: string[] = curFolder.split('\\');
      const workspaceFolders: string[] = folders.slice(0, -2);
      const parentPath: string = workspaceFolders.join('\\');
      return parentPath;
   }
}
