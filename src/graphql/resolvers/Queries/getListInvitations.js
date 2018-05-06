import { authorizeGetListInvitations } from '../../businessLogic';

export const getListInvitations = ({ id }, args, { models: { Invitation } }) =>
  authorizeGetListInvitations(id, args, Invitation);
