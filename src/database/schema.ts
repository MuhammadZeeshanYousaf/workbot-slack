export type WorkbotSchema = {
  teamId: string;
  botId: string;
  botToken: string;
  botUserId: string;
  userToken?: string;
  userId?: string;
  companyUuid: string | null;
  email: string | null;
  channelConversations: object;
};
