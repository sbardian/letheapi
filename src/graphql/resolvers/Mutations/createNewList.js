import { AuthenticationError } from 'apollo-server';
import { isTokenValid } from '../checkAuth';
import { returnLists } from '../../../database/utils';
import { LIST_ADDED } from '../../events';

export const createNewList = async (
  root,
  { ListInfo: { title } },
  { models: { List, User, BlacklistedToken }, user, pubsub, token },
) => {
  if (!(await isTokenValid(token, BlacklistedToken))) {
    throw new AuthenticationError('Invalid token');
  }
  if (user) {
    if (!title) {
      throw new Error('A title is required.');
    }
    const newList = returnLists(
      await List.create({
        title,
        owner: user.id,
        users: [user.id],
        items: [],
      }),
    );
    const userfound = await User.findById(user.id);
    const { lists } = userfound;
    const { id } = newList;
    await User.findByIdAndUpdate(user.id, { lists: [...lists, id] });
    pubsub.publish(LIST_ADDED, {
      listAdded: {
        ...newList,
        __typename: 'List',
      },
    });
    return newList;
  }
  throw new Error('You must be logged in to create a list.');
};
