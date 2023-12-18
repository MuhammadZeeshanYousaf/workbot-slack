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
  LinkCompanyViewTitle = 'Link WorkHub Company',
  LinkCompanyViewId = 'link_company_view',
  UnlinkCompanyText = 'Unlink Company',
  UnlinkCompanyId = 'unlink_company',
  LinkAgain = 'Link Again',
  ViewCancel = 'Cancel',
  ViewClose = 'Close'
}

export enum Messages {
  Wait = 'Please wait...',
  CheckingAccount = '_Please wait, while we are checking your account..._',
  NoLinkedCompany = '_No linked WorkHub Company found!_',
  NoCompanyLinkedYet = '_You have not linked your WorkHub company yet!_',
  CompanyUnlinked = '_You have unlinked your WorkHub Company successfully._',
  CompanyAlreadyLinked = '_You have already linked your WorkHub Company._',
  CompanyLinked = '_You have successfully linked_',
  FailedToCreateConversation = '_Failed to establish your conversation with WorkBot!_',
  FailedToAddMember = '_Failed to add you to this conversation!_ \n\nEither you are not a part of linked WorkHub company or you do not have exisiting WorkHub account.',
  NoWorkhubAccount = "_You don't have an existing account on WorkHub. In order to use this app, you must have a WorkHub account, Please <https://www.workhub.ai/contact/|contact> our support team for more information or get yourself registered <https://app.workhub.ai/signup/workbot|here>._"
}
