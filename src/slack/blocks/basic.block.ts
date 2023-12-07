import { Block, KnownBlock } from '@slack/bolt';

export const basicBlock = (txt): Array<Block | KnownBlock> => {
  return [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: txt
      }
    }
  ];
};
