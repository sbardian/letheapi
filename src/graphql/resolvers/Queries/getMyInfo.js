import { authorizeGetMyInfo } from '../../businessLogic';

export const getMyInfo = (root, args, { models: { User }, user, isAdmin }) =>
  authorizeGetMyInfo(user, User);
