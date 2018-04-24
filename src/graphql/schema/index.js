import { makeExecutableSchema } from 'graphql-tools';
import { resolvers } from '../resolvers';
import typeDefs from './typeDefs.graphql';

export default makeExecutableSchema({
  resolvers,
  typeDefs,
});
