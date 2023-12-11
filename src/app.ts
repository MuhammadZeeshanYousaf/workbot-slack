import { App, LogLevel } from '@slack/bolt';
import { ExtendedErrorHandlerArgs } from '@slack/bolt/dist/App';
import { DBInstallationStore } from '~/store';
import { Database } from '~/database';
import { SlackCallbacks } from '~/slack/callbacks';
import { routes } from '~/routes';
import '~/utils/bugsnagClient';
import Bugsnag from '@bugsnag/js';

export const database = new Database();

export const app = new App({
  logLevel: LogLevel.ERROR,
  extendedErrorHandler: true,
  processBeforeResponse: true,
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

app.error(async (errorObject: ExtendedErrorHandlerArgs) => {
  // Log the error using the logger passed into Bolt
  errorObject.logger.error(errorObject);

  Bugsnag.notify(errorObject.error);
});
