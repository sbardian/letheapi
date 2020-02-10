import createApolloServer from './createApolloServer';

describe('Apollo Server tests', () => {
  it('Should return an instance of apolloServer', () => {
    expect.assertions(2);
    const testApolloServer = createApolloServer();
    expect(testApolloServer).toHaveProperty('applyMiddleware');
    expect(testApolloServer).toHaveProperty('installSubscriptionHandlers');
  });
});
