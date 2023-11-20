import { CustomRoute } from '@slack/bolt';

const root: CustomRoute = {
  path: '/',
  method: ['GET'],
  handler: (_req, res) => {
    res.writeHead(200);
    res.end('Welcome to WorkBot Slack app!');
  }
};

export const routes: CustomRoute[] = [root];
