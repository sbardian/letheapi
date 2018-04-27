import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { login, signup, createNewItems, createNewGroups } from './Mutations';
import {
  getItems,
  getUsers,
  getGroups,
  getGroupsUsers,
  getUsersGroups,
} from './Queries';
import { JWT_SECRET } from '../../config/config';

const resolvers = {
  Query: {
    getItems,
    getUsers,
    getGroups,
  },
  Mutation: {
    login,
    signup,
    createNewItems,
    createNewGroups,
  },
  Group: {
    users: getGroupsUsers,
  },
  User: {
    groups: getUsersGroups,
  },
};

export default resolvers;
