## Description
A basic typescript project that is able to build and compile and has some predefined config files that are loading based on the enviroment
Uses docker in dev and prod or could start a local instance. Has a basic unit test setup

## How to use
1. git@github.com:yauseyea/sample-ts-project.git
2. npm install
3. npm run:local or create a launch.json file for the debugging in vscode and paste the launch.json from the ressource folder and start the debugger
4. For running it in docker create the dev.env and prod.env files (like in the previous step) and run: npm run docker-dev or npm run docker-prod

## Next steps
- Adjust the project to your needs