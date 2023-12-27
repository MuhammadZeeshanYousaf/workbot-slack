import { app } from '~/app';
import { linkCompanyViewHandler } from './handlers';
import { SlackActions } from '~/globals';

app.view(SlackActions.LinkCompanyViewId, async (args: any) => {
  await linkCompanyViewHandler(args);
});
