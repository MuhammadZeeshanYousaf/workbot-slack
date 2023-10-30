import { App, LogLevel } from '@slack/bolt';
import { DbInstallationStore } from '~/store';
import { Database } from '~/database';

export const database = new Database();

export const app = new App({
  logLevel: LogLevel.DEBUG,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  stateSecret: process.env.SLACK_STATE_SECRET,
  scopes: ['app_mentions:read', 'chat:write', 'commands', 'users:read', 'users:read.email'],
  installerOptions: {
    directInstall: true
  },
  installationStore: new DbInstallationStore()
});

// Pass to next middleware
app.use(async ({ next }) => {
  await next();
});
