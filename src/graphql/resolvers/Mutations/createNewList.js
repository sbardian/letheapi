import { returnLists } from '../../../database/utils';

export const createNewList = async (
  root,
  { ListInfo: { title } },
  { models: { List, User }, user },
) => {
  if (user) {
    if (!title) {
      throw new Error('A title is required.');
    }
    const newList = await List.create({
      title,
      owner: user.id,
      users: [user.id],
      items: [],
    });
    const userfound = await User.findById(user.id);
    const { lists } = userfound;
    const { id } = newList;
    await User.findByIdAndUpdate(user.id, { lists: [...lists, id] });
    return returnLists(newList);
  }
  throw new Error('You must be logged in to create a list.');
};
