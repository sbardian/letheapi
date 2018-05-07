import { authorizeDeleteInvitation } from './authorizeDeleteInvitation';

export const authorizeDeclineInvitation = (
  user,
  invitationId,
  Invitation,
  List,
) => authorizeDeleteInvitation(user, invitationId, Invitation, List);
