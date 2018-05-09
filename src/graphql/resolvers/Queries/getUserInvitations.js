import { returnInvitations } from '../../../database/utils';

export const getUserInvitations = async (
  { id },
  args,
  { models: { Invitation } },
) => (await Invitation.find({ invitee: id })).map(returnInvitations);
