import { authorizeGetUsers } from '../../businessLogic';

export const getUsers = (root, { username }, { models: { User } }, user) =>
  authorizeGetUsers(user, username, User);
