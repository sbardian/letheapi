import { withFilter } from 'apollo-server';
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
import { pubsub } from '../../server/server';

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
    itemAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([`ITEM_ADDED`]),
        (payload, variables) => payload.itemAdded.list === variables.listId,
      ),
    },
  },
};

export default resolvers;
