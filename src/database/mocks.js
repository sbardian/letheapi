import faker from 'faker';
import bcrypt from 'bcrypt';

const SHOPPING_ITEMS = 30;
const USER_ITEMS = 10;
const GROUPS = [
  { id: '5ae28cf10c213d521013c54b' },
  { id: '5ae28cf10c213d521013c54a' },
];

faker.seed(1337);

export const shoppingItems = Array.from(Array(SHOPPING_ITEMS), () => ({
  title: faker.lorem.words(),
}));

export const userItems = Array.from(Array(USER_ITEMS), () => {
  const password = faker.internet.password();
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  const user = {
    email: faker.internet.email(),
    username: faker.internet.userName(),
    groups: GROUPS,
  };
  console.log(
    `Email: ${user.email}, Username: ${
      user.username
    }, Password: ${password}, Groups: ${GROUPS}`,
  );
  return {
    ...user,
    password: hash,
  };
});
