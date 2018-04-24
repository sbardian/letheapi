import shoppingItems from '../../database/mocks';
import { returnItems } from '../../database/utils';

const resolvers = {
  Query: {
    getItems: async (root, { limit = 500 }, { Item }) =>
      (await Item.find({}).limit(limit)).map(returnItems),
  },
};

export default resolvers;
