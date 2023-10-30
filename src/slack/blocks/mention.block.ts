import { KnownBlock } from '@slack/types';

export const HELP_MSG: Array<KnownBlock> = [
  {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: '*--WorkBot Interactivity--*'
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
  },
  {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: 'To link company: `/workbot link`'
    }
  },
  {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: 'To unlink company: `/workbot unlink`'
    }
  }
];

export const MENTION_MSG: Array<KnownBlock> = [
  {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: 'These are only commands which I support:'
    }
  },
  ...HELP_MSG
];
