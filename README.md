# Slack App for WorkBot

## Production:

App: APP URL goes here

Deployment: Use GitHub Actions

## Staging:

App: <https://workbot-slack.stage-workhub.de/>

Deployment: Use GitHub Actions

## Setup

Please use [workhub-devenv](https://github.com/coeus-solutions/workhub-devenv) for local setup of this and all relevant applications.

After setup, you can initiate the app installation using endpoint: **/slack/install**

**Note:** Always run npm install/remove/update commands inside the docker containers by SShing into them.

```bash
docker-compose exec <container-name> sh
npm install <package_name>
```
