import { withFilter, AuthenticationError } from 'apollo-server';
import { userOfListByListId } from './checkAuth';
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
      resolve: (payload, { listId }, { models: { User }, user }, info) => {
        if (user) {
          if (userOfListByListId(user, listId, User) || user.isAdmin) {
            return payload.itemAdded;
          }
          return new AuthenticationError(
            'You must be a member of the list to subscribe.',
          );
        }
        return new AuthenticationError('Authentication failed.');
      },
      subscribe: withFilter(
        () => pubsub.asyncIterator([`ITEM_ADDED`]),
        (payload, variables) => payload.itemAdded.list === variables.listId,
      ),
    },
    itemDeleted: {
      resolve: (payload, { listId }, { models: { User }, user }, info) => {
        if (user) {
          if (userOfListByListId(user, listId, User) || user.isAdmin) {
            return payload.itemDeleted;
          }
          return new AuthenticationError(
            'You must be a member of the list to subscribe.',
          );
        }
        return new AuthenticationError('Authentication failed.');
      },
      subscribe: withFilter(
        () => pubsub.asyncIterator([`ITEM_DELETED`]),
        (payload, variables) => payload.itemDeleted.list === variables.listId,
      ),
    },
    itemEdited: {
      resolve: (payload, { listId }, { models: { User }, user }, info) => {
        if (user) {
          if (userOfListByListId(user, listId, User) || user.isAdmin) {
            return payload.itemEdited;
          }
          return new AuthenticationError(
            'You must be a member of the list to subscribe.',
          );
        }
        return new AuthenticationError('Authentication failed.');
      },
      subscribe: withFilter(
        () => pubsub.asyncIterator([`ITEM_EDITED`]),
        (payload, variables) => payload.itemEdited.list === variables.listId,
      ),
    },
    listDeleted: {
      resolve: (payload, args, { models: { User }, user }, info) => {
        if (user) {
          if (
            userOfListByListId(user, payload.listDeleted.id, User) ||
            user.isAdmin
          ) {
            return payload.listDeleted;
          }
          return new AuthenticationError(
            'You must be a member of the list to subscribe.',
          );
        }
        return new AuthenticationError('Authentication failed.');
      },
      subscribe: () => pubsub.asyncIterator([`LIST_DELETED`]),
    },
  },
};

export default resolvers;
