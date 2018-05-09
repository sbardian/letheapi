import { ownerOfList, isAdmin } from './';
import { returnInvitations, returnUsers } from '../../database/utils';

export const authorizeCreateInvitation = async (
  user,
  listId,
  invitee,
  title,
  Invitation,
  List,
  User,
) => {
  if (ownerOfList(user, listId, List) || isAdmin(user)) {
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