import { authorizeGetListUsers } from '../../businessLogic';

export const getListUsers = ({ id }, args, { models: { User } }) =>
  authorizeGetListUsers(id, args, Users);
