import { CallbackOptions, InstallURLOptions, Installation } from '@slack/oauth';
import { IncomingMessage, ServerResponse } from 'http';
import { thankyoupage } from '~/globals/thankyou';

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
    const logoUrl = 'https://getbravo-ic.s3.eu-central-1.amazonaws.com/prod/document/company_5fTZmON9DmSH1mMagjhhIQ';

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

    const htmlResponse = thankyoupage({ redirectUrl: redirectUrl, browserUrl: browserUrl, logoUrl: logoUrl });
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(htmlResponse);
  }
}
