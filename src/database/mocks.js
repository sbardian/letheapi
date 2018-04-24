import faker from 'faker';

const SHOPPING_ITEMS = 30;

faker.seed(1337);

export const shoppingItems = Array.from(Array(SHOPPING_ITEMS), () => ({
  title: faker.lorem.words(),
}));
