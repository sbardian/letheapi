import { PubSub } from 'graphql-subscriptions';
import faker from 'faker';

const pubsub = new PubSub();

export const getMessages = () =>
  setInterval(() => {
    pubsub.publish('newMessage', {
      message: faker.lorem.words(),
    });
  }, 1000);
