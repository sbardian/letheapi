import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createNewItems, login, signup } from './Mutations';
import { getItems } from './Queries';
import { JWT_SECRET } from '../../config/config';

const resolvers = {
  Query: {
    getItems,
  },
  Mutation: {
    createNewItems,
    login,
    signup,
  },
};

export default resolvers;
