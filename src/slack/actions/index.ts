import { app, database } from '~/app';
import { SlackActions } from '~/globals';
import { connectWorkhubHandler, linkCompanyHandler, unlinkCompanyHandler } from './handlers';

app.action(SlackActions.ConnectWorkhubId, async args => {
  await args.ack();
  await args.say('Please wait, while we are checking your account...');
  await connectWorkhubHandler(args);
});

app.action(SlackActions.SelectCompanyId, async args => {
  await args.ack();
  await linkCompanyHandler(args);
});

app.action(SlackActions.UnlinkCompanyId, async args => {
  await args.ack();
  await unlinkCompanyHandler(args);
});
