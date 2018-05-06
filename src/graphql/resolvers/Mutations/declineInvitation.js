import { authorizeDeclineInvitation } from '../../businessLogic';

export const declineInvitation = (
  root,
  { invitationId },
  { models: { Invitation, List, User }, user },
) => authorizeDeclineInvitation(user, invitationId, Invitation, List, User);
