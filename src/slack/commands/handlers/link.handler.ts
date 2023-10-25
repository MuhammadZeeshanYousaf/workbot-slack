import { AllMiddlewareArgs, SlackActionMiddlewareArgs } from '@slack/bolt';
import { connectWorkhubHandler } from '~/slack/actions/handlers';

export const linkCompanySlashHandler = async args => {
  await connectWorkhubHandler(args as SlackActionMiddlewareArgs & AllMiddlewareArgs);
};
