import { AuthenticationError } from 'apollo-server';
import {
  returnInvitations,
  returnUsers,
  returnLists,
} from '../../../database/utils';
import { ownerOfList, isTokenValid } from '../checkAuth';
import { INVITATION_ADDED } from '../../events';

export const createInvitation = async (
  root,
  { listId, invitee, title },
  { models: { Invitation, List, User, BlacklistedToken }, user, pubsub, token },
) => {
  if (!(await isTokenValid(token, BlacklistedToken))) {
    throw new AuthenticationError('Invalid token');
  }
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
    const list = returnLists(await List.findById(listId));
    const invitation = returnInvitations(
      await Invitation.findOneAndUpdate(
        {
          invitee: invitedUser.id,
          list: list.id,
        },
        {
          inviter: invitingUser,
          invitee: invitedUser,
          title,
          list,
        },
        { new: true, upsert: true },
      ),
    );
    pubsub.publish(INVITATION_ADDED, {
      invitationAdded: {
        ...invitation,
        __typename: 'Invitation',
      },
    });
    return invitation;
  }
  throw new Error('You must be the list owner to invite other users.');
};
