import { authorizeGetListInvitations } from '../../businessLogic';

export const getListInvitations = (list, args, context) =>
  authorizeGetListInvitations(list, args, context);
