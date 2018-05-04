import { returnInvitations } from '../../database/utils';

export const authorizeGetListInvitations = async (
  { id },
  args,
  { models: { Invitations } },
) => (await Invitations.find({ list: id })).map(returnInvitations);
