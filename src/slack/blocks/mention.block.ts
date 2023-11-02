import { KnownBlock } from '@slack/types';

export const HELP_MSG: Array<KnownBlock> = [
  {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `For query: <@${process.env.BOT_USER_ID}> \`[question]\` or \`/workbot query [question]\``
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
      text: 'These are the only commands which I support:'
    }
  },
  ...HELP_MSG
];
