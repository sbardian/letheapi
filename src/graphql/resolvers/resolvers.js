import Item from '../../database/model';
import shoppingItems from '../../database/mocks';

const resolvers = {
  Query: {
    getItems() {
      return Item.find({});
    },
  },
};

export default resolvers;
