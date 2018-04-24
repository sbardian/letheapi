// import Item from '../../database/model';
import shoppingItems from '../../database/mocks';
import { returnItems } from '../../database/utils';

const resolvers = {
  Query: {
    getItems: async (root, args, { Item }) =>
      (await Item.find({})).map(returnItems),
  },
};

export default resolvers;
