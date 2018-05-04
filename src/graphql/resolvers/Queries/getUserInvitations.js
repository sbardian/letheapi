import { authorizeGetUserInvitations } from '../../businessLogic';

export const getUserInvitations = ({ id }, args, { models: { Invitation } }) =>
  authorizeGetUserInvitations(id, args, Invitation);
