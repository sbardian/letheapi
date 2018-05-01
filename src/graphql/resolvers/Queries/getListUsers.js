import { authorizeGetListUsers } from '../../businessLogic';

export const getListUsers = (list, args, context) =>
  authorizeGetListUsers(list, args, context);
