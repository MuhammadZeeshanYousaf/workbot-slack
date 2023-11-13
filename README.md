# Slack App for WorkBot

## Production:

App: APP URL goes here

Deployment: Use GitHub Actions

## Staging:

App: <https://workbot-slack.stage-workhub.de/>

Deployment: Use GitHub Actions

## Docker Environment Initialization

1. Clone the project

2. Create docker-compose.yml from dist file

   ```bash
   cd ./
   cp docker-compose.yml.dist docker-compose.yml
   ```

3. Create .env from local file and modify values accordingly

   ```bash
   cd ./
   cp .env.local .env
   ```

4. To build the docker image:

   ```bash
   docker-compose build
   ```

5. To start the containers:

   ```bash
   docker-compose up
   ```

6. You can now access the url directly via <http://localhost:3000>

7. To remove network and containers, run the following command:

   ```bash
   docker-compose down
   ```

   Note: Always run npm install/remove/update commands inside the docker containers by SShing into them.

   ```bash
   docker-compose exec container-name sh
   npm install package_name
   ```
