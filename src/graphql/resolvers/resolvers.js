import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  login,
  signup,
  createNewItem,
  createNewList,
  deleteItem,
} from './Mutations';
import {
  getListItems,
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
    deleteItem,
  },
  List: {
    users: getListUsers,
    items: getListItems,
  },
  User: {
    lists: getUserLists,
  },
};

export default resolvers;
