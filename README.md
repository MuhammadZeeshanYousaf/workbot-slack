# Slack App for WorkBot

## Production:

App: <https://workbot-slack.workhub.ai/>

Deployment: Use GitHub Actions

## Staging:

App: <https://workbot-slack.stage-workhub.de/>

Deployment: Use GitHub Actions

## Setup

Please use [workhub-devenv](https://github.com/coeus-solutions/workhub-devenv) for local setup of this and all relevant applications.

After setup, you can initiate the app installation using endpoint: **/slack/install**

**Note:** Always run npm install/remove/update commands inside the docker containers by SShing into them.

```bash
docker exec -it <container_name> /bin/bash
npm install <package_name>
```
