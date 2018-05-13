import faker from 'faker';
import bcrypt from 'bcrypt';

const SHOPPING_ITEMS = 10;
const USER_ITEMS = 10;
const LIST_ITEMS = 5;
const LISTS = 2;

faker.seed(1337);

export const shoppingItems = Array.from(Array(SHOPPING_ITEMS), () => ({
  title: faker.lorem.words(),
}));

export const listItems = (count, users) =>
  Array.from(Array(count), () => ({
    title: faker.company.companyName(),
    owner: users[0].id,
    users: users,
    items: [],
  }));

export const userItems = count =>
  Array.from(Array(count), () => {
    const password = faker.internet.password();
    const isAdmin = faker.random.boolean();
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const user = {
      email: faker.internet.email(),
      username: faker.internet.userName(),
      lists: [],
      isAdmin,
    };
    console.log(
      `Email: ${user.email}, Username: ${user.username}, Password: ${password}`,
    );
    return {
      ...user,
      password: hash,
    };
  });
