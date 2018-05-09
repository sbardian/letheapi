import { returnInvitations } from '../../../database/utils';

export const getListInvitations = async (
  { id },
  args,
  { models: { Invitation } },
) => (await Invitation.find({ list: id })).map(returnInvitations);
