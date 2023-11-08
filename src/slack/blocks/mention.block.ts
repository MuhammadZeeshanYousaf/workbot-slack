import { KnownBlock } from '@slack/types';

export const HELP_MSG: Array<KnownBlock> = [
  {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `To ask from your WorkBot use: *@WorkBot* _[question]_`
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
      text: 'These are the only commands which I support:'
    }
  },
  ...HELP_MSG
];
