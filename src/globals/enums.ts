export enum STATUSCODE {
  UNAUTHORIZED = 401,
  BAD_REQUEST = 400,
  SUCCESS = 200,
  CREATED = 201,
  DELETED = 204,
  INTERNAL_SERVER_ERROR = 500,
  NOT_FOUND = 404,
  FORBIDDEN = 403
}

export enum SlackActions {
  ConnectWorkhubText = 'Connect Workhub Account',
  ConnectWorkhubId = 'connect_workhub_account',
  SelectCompanyText = 'Select Company',
  SelectCompanyId = 'select_company'
}
