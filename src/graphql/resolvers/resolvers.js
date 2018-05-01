import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { login, signup, createNewItem, createNewList } from './Mutations';
import {
  getItems,
  getUser,
  getLists,
  getListUsers,
  getUserLists,
} from './Queries';
import { JWT_SECRET } from '../../config/config';

const resolvers = {
  Query: {
    getUser,
    getLists,
  },
  Mutation: {
    login,
    signup,
    createNewItem,
    createNewList,
  },
  List: {
    users: getListUsers,
    items: getItems,
  },
  User: {
    lists: getUserLists,
    items: getItems,
  },
};

export default resolvers;
