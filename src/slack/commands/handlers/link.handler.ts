import { connectWorkhubHandler } from '~/slack/actions/handlers';

export const linkCompanySlashHandler = async args => {
  await connectWorkhubHandler(args);
};
