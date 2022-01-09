import { AuthenticationError } from 'apollo-server';
import { returnInvitations } from '../../../database/utils';
import { ownerOfList, isTokenValid } from '../checkAuth';
import { INVITATION_DELETED } from '../../events';

export const deleteInvitation = async (
  root,
  { invitationId },
  { models: { Invitation, List, BlacklistedToken }, user, pubsub, token },
) => {
  if (!(await isTokenValid(token, BlacklistedToken))) {
    throw new AuthenticationError('Invalid token');
  }
  const invitation = returnInvitations(await Invitation.findById(invitationId));
  console.log('invitation: ', invitation);
  console.log(
    'user.id = ',
    user.id,
    '.  invitation.invitee.id = ',
    invitation.invitee.id,
  );
  if (
    (await ownerOfList(user, invitation.list, List)) ||
    user.isAdmin ||
    user.id === invitation.invitee
  ) {
    console.log('you made it in!');
    const deletedInvitation = returnInvitations(
      await Invitation.findByIdAndRemove(invitationId),
    );
    pubsub.publish(INVITATION_DELETED, {
      invitationDeleted: {
        ...deletedInvitation,
        __typename: 'Invitation',
      },
    });
    return deletedInvitation;
  }
  throw new Error('You do not have permission to delete this invitation.');
};
