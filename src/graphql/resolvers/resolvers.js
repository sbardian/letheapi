import { PubSub } from 'apollo-server';
import {
  login,
  signup,
  createNewItem,
  createNewList,
  deleteItem,
  deleteList,
  createInvitation,
  deleteInvitation,
  declineInvitation,
  acceptInvitation,
  removeFromList,
  updateList,
  updateItem,
  profileImageUpload,
} from './Mutations';
import {
  getMyInfo,
  getUser,
  getUsers,
  getUserLists,
  getLists,
  getListItems,
  getListUsers,
  getListInvitations,
  getUserInvitations,
  getMessages,
} from './Queries';

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
    createInvitation,
    deleteInvitation,
    declineInvitation,
    acceptInvitation,
    removeFromList,
    updateList,
    updateItem,
    profileImageUpload,
  },
  List: {
    users: getListUsers,
    items: getListItems,
    invitations: getListInvitations,
  },
  User: {
    lists: getUserLists,
    invitations: getUserInvitations,
  },
  Subscription: {
    message: {
      subscribe: getMessages,
    },
  },
};

export default resolvers;
