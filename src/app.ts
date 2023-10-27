import { App, LogLevel } from '@slack/bolt';
import { FileInstallationStore } from '@slack/oauth';

export const app = new App({
  logLevel: LogLevel.DEBUG,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  stateSecret: process.env.SLACK_STATE_SECRET,
  scopes: [
    'chat:write',
    'commands',
    'users:read',
    'users:read.email',
    'im:history',
    'mpim:history',
    'channels:read',
    'channels:history'
  ],
  installationStore: new FileInstallationStore()
});
