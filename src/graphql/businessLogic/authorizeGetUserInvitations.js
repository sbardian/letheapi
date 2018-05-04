import { returnInvitations } from '../../database/utils';

export const authorizeGetUserInvitations = async (id, args, Invitation) =>
  (await Invitation.find({ invitee: id })).map(returnInvitations);
