import { authorizeGetUsers } from '../../businessLogic';

export const getUsers = (root, args, { models: { User }, user, isAdmin }) =>
  authorizeGetUsers(user, User);
