import { deleteInvitation } from './';

export const declineInvitation = async (
  root,
  { invitationId },
  { models: { Invitation, List }, user },
) => deleteInvitation(user, invitationId, Invitation, List);
