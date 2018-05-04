import { authorizeDeleteInvitation } from '../../businessLogic';

export const deleteInvitation = (
  root,
  { invitationId },
  { models: { Invitation, List }, user },
) => authorizeDeleteInvitation(user, invitationId, Invitation, List);
