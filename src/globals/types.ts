export type WorkhubUser = {
  email?: string;
  fullName?: string;
  uuid: string;
  userToken: string;
};

export type WorkHubCompany = {
  name: string;
  uuid: string;
};

export type PostQueryParams = {
  userQuery: string;
  userToken: string;
  userUuid: string;
  userEmail: string;
  ownerEmail: string;
  companyUuid: string;
  conversationUuid: string;
  channelConversations: object;
  channelId: string;
};

export type ChannelConversation = {
  conversationUuid: string;
  ownerEmail: string;
};
