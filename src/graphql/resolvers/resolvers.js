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
};

export default resolvers;
