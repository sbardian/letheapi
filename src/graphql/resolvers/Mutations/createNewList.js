import { returnLists } from '../../../database/utils';

export const createNewList = async (
  root,
  { ListInfo: { title } },
  { models: { List, User }, user },
) => {
  // TODO implement user check?
  const newList = await List.create({
    title,
    owner: user.id,
    users: [user.id],
    items: [],
  });
  const userfound = await User.findById(user.id);
  const { lists } = userfound;
  const { id } = newList;
  await User.update({ _id: user.id }, { $set: { lists: [...lists, id] } });
  return returnLists(newList);
};
