import DataLoader from 'dataloader';

export const getListOwnerLoader = ({ User }) =>
  new DataLoader(async (ownerIds) => {
    const owners = await User.find({ _id: { $in: ownerIds } });
    return ownerIds.map((ownerId) => owners.find(({ id }) => ownerId === id));
  });
