import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  login,
  signup,
  createNewItem,
  createNewList,
  deleteItem,
  deleteList,
} from './Mutations';
import {
  getMyInfo,
  getUser,
  getUsers,
  getUserLists,
  getLists,
  getListItems,
  getListUsers,
} from './Queries';
import { JWT_SECRET } from '../../config/config';

const resolvers = {
  Query: {
    getMyInfo,
    getUser,
    getUsers,
    getLists,
  },
  Mutation: {
    login,
    signup,
    createNewItem,
    createNewList,
    deleteItem,
    deleteList,
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
