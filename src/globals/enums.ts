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
  ConnectWorkhubText = 'Connect WorkHub Company',
  ConnectWorkhubId = 'connect_workhub_company',
  SelectCompanyText = 'Select Company',
  SelectCompanyId = 'select_company',
  LinkCompanyText = 'Link Company',
  LinkCompanyId = 'link_company',
  UnlinkCompanyText = 'Unlink Company',
  UnlinkCompanyId = 'unlink_company'
}

export enum ErrorMessages {
  NoWorkhubAccount = "You don't have an existing account on WorkHub. In order to use this app, you must have a WorkHub account, Please <https://www.workhub.ai/contact/|contact> our support team for more information or get yourself registered <https://app.workhub.ai/signup/workbot|here>."
}
