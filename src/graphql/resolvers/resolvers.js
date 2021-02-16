import {
  login,
  logout,
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
  getItemCreator,
  getMyInfo,
  getUser,
  getUsers,
  getUserLists,
  getLists,
  getListOwner,
  getListItems,
  getListUsers,
  getListInvitations,
  getUserInvitations,
  getInvitationInvitee,
  getInvitationInviter,
  getInvitationList,
} from './Queries';
import {
  itemAdded,
  itemDeleted,
  itemEdited,
  listAdded,
  listDeleted,
  listEdited,
  invitationAdded,
  invitationDeleted,
  listSettingsUpdated,
} from './Subscriptions';

const resolvers = {
  Query: {
    getMyInfo,
    getUser,
    getUsers,
    getLists,
  },
  Mutation: {
    login,
    logout,
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
    owner: getListOwner,
    invitations: getListInvitations,
  },
  User: {
    lists: getUserLists,
    invitations: getUserInvitations,
  },
  Item: {
    creator: getItemCreator,
  },
  Invitation: {
    invitee: getInvitationInvitee,
    inviter: getInvitationInviter,
    list: getInvitationList,
  },
  Subscription: {
    itemAdded,
    itemDeleted,
    itemEdited,
    listAdded,
    listDeleted,
    listEdited,
    invitationAdded,
    invitationDeleted,
    listSettingsUpdated,
  },
};

export default resolvers;
