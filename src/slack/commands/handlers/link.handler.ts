import { AllMiddlewareArgs, SlackActionMiddlewareArgs, SlackCommandMiddlewareArgs } from '@slack/bolt';
import { connectWorkhubHandler } from '~/slack/actions/handlers';

export const linkCompanySlashHandler = async (args: SlackCommandMiddlewareArgs & AllMiddlewareArgs) => {
  await connectWorkhubHandler(args);
};
