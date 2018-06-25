import { PubSub } from 'apollo-server';
import faker from 'faker';

const pubsub = new PubSub();

export const getMessages = () => {
  setInterval(() => {
    pubsub.publish('MESSAGE', {
      message: faker.lorem.words(),
    });
  }, 1000);
};
