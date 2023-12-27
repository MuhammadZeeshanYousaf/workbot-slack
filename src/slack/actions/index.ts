import { app } from '~/app';
import { SlackActions } from '~/globals';
import { connectWorkhubHandler, unlinkCompanyHandler } from './handlers';

app.action(SlackActions.ConnectWorkhubId, async (args: any) => {
  await args.ack();
  await connectWorkhubHandler(args);
});

app.action(SlackActions.UnlinkCompanyId, async args => {
  await args.ack();
  await unlinkCompanyHandler(args);
});
