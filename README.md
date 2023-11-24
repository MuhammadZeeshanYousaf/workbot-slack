# Slack App for WorkBot

## Production:

App: APP URL goes here

Deployment: Use GitHub Actions

## Staging:

App: <https://workbot-slack.stage-workhub.de/>

Deployment: Use GitHub Actions

## Docker Environment Initialization

1. Clone the repository

2. Rename .env.local to .env and modify values accordingly

   ```bash
   cd ./
   cp .env.local .env
   ```

3. After docker build and starting container, you can initiate the app installation using endpoint: **/slack/install**

   **Note:** Always run npm install/remove/update commands inside the docker containers by SShing into them.

   ```bash
   docker-compose exec <container-name> sh
   npm install <package_name>
   ```
