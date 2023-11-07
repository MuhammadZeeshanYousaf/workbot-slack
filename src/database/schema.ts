export type WorkbotSchema = {
  teamId: string;
  botId: string;
  botToken: string;
  botUserId: string;
  userToken?: string;
  userId?: string;
  linkedCompanyUuid: string | null;
  linkedBy: string | null;
  channelConversations: object;
  installedAt: string;
  uninstalledAt: string | null;
};
