import { App, LogLevel } from '@slack/bolt';
import { DBInstallationStore } from '~/store';
import { Database } from '~/database';
import { SlackCallbacks } from '~/slack/callbacks';
import { routes } from '~/routes';

export const database = new Database();

export const app = new App({
  logLevel: LogLevel.DEBUG,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  stateSecret: process.env.SLACK_STATE_SECRET,
  scopes: ['app_mentions:read', 'chat:write', 'commands', 'users:read', 'users:read.email', 'im:history'],
  installerOptions: {
    directInstall: true,
    callbackOptions: new SlackCallbacks()
  },
  installationStore: new DBInstallationStore(),
  customRoutes: routes
});

// Pass to next middleware
app.use(async ({ next }) => {
  await next();
});
