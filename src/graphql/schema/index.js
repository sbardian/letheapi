import { gql } from 'apollo-server';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { resolvers } from '../resolvers';
import typeDefs from './typeDefs.graphql';

export default makeExecutableSchema({
  resolvers,
  typeDefs: gql(typeDefs),
});
