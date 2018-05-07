import { authorizeDeclineInvitation } from '../../businessLogic';

export const declineInvitation = (
  root,
  { invitationId },
  { models: { Invitation, List }, user },
) => authorizeDeclineInvitation(user, invitationId, Invitation, List);
