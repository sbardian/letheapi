import { getListItemsLoader } from './getListItemsLoader';
import { getUserLoader } from './getUserLoader';
import { getUserListsLoader } from './getUserListsLoader';
import { getUserInvitationsLoader } from './getUserInvitationsLoader';
import { getListUsersLoader } from './getListUsersLoader';
import { getMyInfoLoader } from './getMyInfoLoader';
import { getListInvitationsLoader } from './getListInvitationsLoader';
import { getListsLoader } from './getListsLoader';
import { getItemCreatorLoader } from './getItemCreatorLoader';
import { getInvitationInviteeLoader } from './getInvitationInviteeLoader';
import { getInvitationInviterLoader } from './getInvitationInviterLoader';
import { getInvitationListLoader } from './getInvitationListLoader';
import { getListOwnerLoader } from './getListOwnerLoader';
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
  getInvitationInviteeLoader: getInvitationInviteeLoader({ User }),
  getInvitationInviterLoader: getInvitationInviterLoader({ User }),
  getInvitationListLoader: getInvitationListLoader({ List }),
  getListOwnerLoader: getListOwnerLoader({ User }),
});
