import { Installation, InstallationQuery, InstallationStore } from '@slack/bolt';
import { Logger } from '@slack/web-api';
import { WorkbotSchema } from '~/database/schema';
import { database } from '~/app';
import { SlackInstallation } from '~/globals';

export class DbInstallationStore implements InstallationStore {
  constructor() {}

  async storeInstallation(installation: Installation, logger?: Logger): Promise<any> {
    if (installation.team?.id !== undefined && installation.bot?.token !== undefined) {
      const prevInstallation = await database.get(installation.team.id);
      let data: WorkbotSchema = {
        teamId: installation.team.id,
        botId: installation.bot.id,
        botToken: installation.bot.token,
        botUserId: installation.bot.userId,
        userToken: installation.user?.token,
        userId: installation.user?.id,
        linkedCompanyUuid: null,
        linkedBy: null,
        channelConversations: {},
        installedAt: new Date().toISOString(),
        uninstalledAt: null
      };

      if (prevInstallation !== undefined) {
        data = {
          ...data,
          linkedCompanyUuid: prevInstallation.linkedCompanyUuid,
          linkedBy: prevInstallation.linkedBy,
          channelConversations: prevInstallation.channelConversations,
          installedAt: new Date().toISOString()
        };
      }

      return await database.set(data);
    }

    logger?.error('Installation data is invalid!');
  }

  async fetchInstallation(installQuery: InstallationQuery<boolean>, logger?: Logger): Promise<SlackInstallation | any> {
    if (installQuery.teamId !== undefined) {
      const data: WorkbotSchema = await database.get(installQuery.teamId);

      const installation: SlackInstallation = {
        bot: {
          id: data?.botId,
          token: data.botToken,
          userId: data?.botUserId
        }
      };
      return installation;
    }

    logger?.error('teamId does not exist!');
  }

  async deleteInstallation(installQuery: InstallationQuery<boolean>, logger?: Logger): Promise<void> {
    if (installQuery.teamId !== undefined) {
      return await database.delete(installQuery.teamId);
    }

    logger?.error('teamId does not exist!');
  }
}
