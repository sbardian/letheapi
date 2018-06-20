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
    const invitingUser = returnUsers(
      await User.findOne({
        _id: user.id,
      }),
    );
    return returnInvitations(
      await Invitation.findOneAndUpdate(
        {
          invitee: invitedUser.id,
          list: listId,
        },
        {
          inviter: invitingUser,
          invitee: invitedUser.id,
          title,
          list: listId,
        },
        { new: true, upsert: true },
      ),
    );
  }
  throw new Error('You must be the list owner to invite other users.');
};
