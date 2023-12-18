import { CallbackOptions, InstallURLOptions, Installation } from '@slack/oauth';
import { WebClient } from '@slack/web-api';
import { IncomingMessage, ServerResponse } from 'http';
import { thankyoupage } from '~/globals/thankyou';
import { welcomeBlock } from '~/slack/blocks';

export class SlackCallbacks implements CallbackOptions {
  constructor() {}

  success(
    installation: Installation,
    _options: InstallURLOptions | undefined,
    _req: IncomingMessage,
    res: ServerResponse
  ): void {
    let redirectUrl: string;
    let browserUrl: string;

    if (installation.appId !== undefined && installation.team !== undefined) {
      // redirect back to Slack native app
      // Changes to the workspace app was installed to, to the app home
      redirectUrl = `slack://app?team=${installation.team.id}&id=${installation.appId}`;
      browserUrl = `https://app.slack.com/client/${installation.team.id}`;
    } else {
      // redirect back to Slack native app
      // does not change the workspace the slack client was last in
      redirectUrl = 'slack://open';
      browserUrl = redirectUrl;
    }

    const htmlResponse = thankyoupage({ redirectUrl: redirectUrl, browserUrl: browserUrl });
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(htmlResponse);

    if (installation.bot !== undefined) {
      // Send a welcome message to the user as a DM
      const client = new WebClient(installation.bot.token);
      client.chat.postMessage({
        token: installation.bot.token,
        channel: installation.user.id,
        text:
          `Hi there <@${installation.user.id}> :wave: \nGreat to see you here!` +
          '\n\n WorkBot is an AI platform that centralizes knowledge management and enables automations across the organization. Slack integration for WorkBot makes it easier to answer your queries within Slack.',
        blocks: welcomeBlock(installation.user.id)
      });
    }
  }
}
