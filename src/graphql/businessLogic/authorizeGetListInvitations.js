import { returnInvitations } from '../../database/utils';

export const authorizeGetListInvitations = async (id, args, Invitations) =>
  (await Invitations.find({ list: id })).map(returnInvitations);
