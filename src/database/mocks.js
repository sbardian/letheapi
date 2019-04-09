import faker from 'faker';
import bcrypt from 'bcrypt';

faker.seed(1337);

export const insertInvitationItems = (count, list, user, invitee) =>
  Array.from(Array(count), () => ({
    inviter: user,
    invitee,
    title: faker.lorem.words(),
    list: list.id,
  }));

export const insertMockItems = (count, list, user) =>
  Array.from(Array(count), () => ({
    title: faker.lorem.words(),
    list: list.id,
    creator: user[0].id,
    status: false,
  }));

export const insertMockLists = (count, users) =>
  Array.from(Array(count), () => ({
    title: faker.company.companyName(),
    owner: users[0].id,
    users: users.map(user => user.id),
    items: [],
  }));

export const insertMockUsers = count =>
  Array.from(Array(count), () => {
    // const password = faker.internet.password();
    const password = 'password';
    const isAdmin = faker.random.boolean();
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const user = {
      email: faker.internet.email(),
      username: faker.internet.userName(),
      lists: [],
      isAdmin,
      profileImage: null,
    };
    console.log(
      `Email: ${user.email}, Username: ${user.username}, Password: ${password}`,
    );
    return {
      ...user,
      password: hash,
    };
  });
