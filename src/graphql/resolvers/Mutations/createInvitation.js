import { returnInvitations, returnUsers } from '../../../database/utils';
import { ownerOfList } from '../checkAuth';

export const createInvitation = async (
  root,
  { listId, invitee, title },
  { models: { Invitation, List, User }, user },
) => {
  if ((await ownerOfList(user, listId, List)) || user.isAdmin) {
    const invitedUser = returnUsers(
      await User.findOne({
        $or: [{ email: invitee }, { username: invitee }],
      }),
    );
    return returnInvitations(
      await Invitation.create({
        inviter: user.id,
        invitee: invitedUser.id,
        title,
        list: listId,
      }),
    );
  } else {
    return new Error('You must be the list owner to invite other users.');
  }
};
