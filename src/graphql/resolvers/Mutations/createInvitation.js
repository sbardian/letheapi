import { authorizeCreateInvitation } from '../../businessLogic';

export const createInvitation = (
  root,
  { listId, invitee, title },
  { models: { Invitation, List, User }, user },
) =>
  authorizeCreateInvitation(
    user,
    listId,
    invitee,
    title,
    Invitation,
    List,
    User,
  );
