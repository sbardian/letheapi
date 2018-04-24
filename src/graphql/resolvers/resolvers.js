import shoppingItems from '../../database/mocks';
import { returnItems } from '../../database/utils';

const resolvers = {
  Query: {
    getItems: async (root, { limit = 500 }, { Item }) =>
      (await Item.find({}).limit(limit)).map(returnItems),
  },
  Mutation: {
    createNewItem: async (root, { titles }, { Item }) =>
      (await Item.create(titles)).map(returnItems),
  },
};

export default resolvers;
