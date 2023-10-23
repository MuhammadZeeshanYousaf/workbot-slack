import { Installation, InstallationQuery, InstallationStore } from '@slack/bolt';
import { Logger } from '@slack/web-api';
import { WorkbotSchema } from '~/database/schema';
import { database } from '~/app';
import { SlackInstallation } from '~/globals';

export class DbInstallationStore implements InstallationStore {
  constructor() {}

  async storeInstallation(installation: Installation, logger?: Logger): Promise<any> {
    if (installation.team?.id !== undefined && installation.bot?.token !== undefined) {
      const data: WorkbotSchema = {
        teamId: installation.team?.id,
        botToken: installation.bot?.token,
        userToken: installation.user.token,
        botId: installation.bot?.id,
        botUserId: installation.bot?.userId,
        userId: installation.user.id
      };
      return await database.set(data);
    }

    throw new Error('Data is invalid!');
  }
  async fetchInstallation(installQuery: InstallationQuery<boolean>, logger?: Logger): Promise<SlackInstallation | any> {
    if (installQuery.teamId !== undefined) {
      return await database.get(installQuery.teamId);
    }

    throw new Error('teamId does not exist!');
  }
  async deleteInstallation(installQuery: InstallationQuery<boolean>, logger?: Logger): Promise<void> {
    if (installQuery.teamId !== undefined) {
      return await database.delete(installQuery.teamId);
    }

    throw new Error('teamId does not exist!');
  }
}
