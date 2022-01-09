import express from 'express';
import { createServer } from 'http';
import createApolloServer, {
  createSubscriptionServer,
} from './createApolloServers';

describe('Apollo Server tests', () => {
  it('Should return an instance of apolloServer', () => {
    expect.assertions(2);
    const app = express();
    const httpServer = createServer(app);
    const subscriptionServer = createSubscriptionServer(httpServer);
    const testApolloServer = createApolloServer(subscriptionServer);
    expect(testApolloServer).toHaveProperty('applyMiddleware');
    expect(testApolloServer.graphqlPath).toEqual('/graphql');
  });
});
