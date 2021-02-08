import { getListItemsLoader } from './getListItemsLoader';
import { getUserLoader } from './getUserLoader';
import { getUserListsLoader } from './getUserListsLoader';
import { getUserInvitationsLoader } from './getUserInvitationsLoader';
import { getListUsersLoader } from './getListUsersLoader';
import { getMyInfoLoader } from './getMyInfoLoader';
import { getListInvitationsLoader } from './getListInvitationsLoader';
import { getListsLoader } from './getListsLoader';
import { getItemCreatorLoader } from './getItemCreatorLoader';
import { Item, User, List, Invitation } from '../../database/models';

export default () => ({
  getListItemsLoader: getListItemsLoader({ Item }),
  getListUsersLoader: getListUsersLoader({ User }),
  getMyInfoLoader: getMyInfoLoader({ User }),
  getUserLoader: getUserLoader({ User }),
  getUserListsLoader: getUserListsLoader({ List }),
  getUserInvitationsLoader: getUserInvitationsLoader({ Invitation }),
  getListInvitationsLoader: getListInvitationsLoader({ Invitation }),
  getListsLoader: getListsLoader({ List }),
  getItemCreatorLoader: getItemCreatorLoader({ User }),
});
