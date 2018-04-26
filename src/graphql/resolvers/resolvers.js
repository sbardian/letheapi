import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { login, signup, createNewItems, createNewGroups } from './Mutations';
import { getItems, getUsers } from './Queries';
import { JWT_SECRET } from '../../config/config';

const resolvers = {
  Query: {
    getItems,
    getUsers,
  },
  Mutation: {
    login,
    signup,
    createNewItems,
    createNewGroups,
  },
};

export default resolvers;
