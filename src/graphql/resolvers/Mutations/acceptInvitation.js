import { authorizeAcceptInvitation } from '../../businessLogic';

export const acceptInvitation = (
  root,
  { invitationId },
  { models: { Invitation, List, User }, user },
) => authorizeAcceptInvitation(user, invitationId, Invitation, List, User);
