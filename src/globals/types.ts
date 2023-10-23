export type WorkhubUser = {
  accessToken: string;
  uuid: string;
  profileImage?: string;
  imageUrl?: string;
  initials?: string;
  email: string;
  tokenExpirationTime?: Number;
  fullName: string;
};
