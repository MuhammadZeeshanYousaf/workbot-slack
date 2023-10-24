import { KnownBlock } from '@slack/types';

export const HELP_MSG: Array<KnownBlock> = [
  {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: '*--Workbot Interactivity--*'
    }
  },
  {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: 'For query: `/workbot query <your-query>`'
    }
  },
  {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: 'For help: `/workbot help`'
    }
  }
];

export const MENTION_MSG: Array<KnownBlock> = [
  {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: 'These are only the command which I support:'
    }
  },
  ...HELP_MSG
];
