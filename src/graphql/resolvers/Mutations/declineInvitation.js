import { deleteInvitation } from './deleteInvitation';

export const declineInvitation = async (
  root,
  { invitationId },
  { models: { Invitation, List }, user },
) => deleteInvitation(user, invitationId, Invitation, List);
