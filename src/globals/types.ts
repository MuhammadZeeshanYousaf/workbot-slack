export type WorkhubUser = {
  email?: string;
  fullName?: string;
  uuid?: string;
  accessToken: string;
};

export type WorkHubCompany = {
  name: string;
  uuid: string;
};

export type PostQueryParams = {
  userQuery: string;
  userToken: string;
  companyUuid: string;
  conversationUuid: string;
  channelConversations: object;
  channelId: string;
};
