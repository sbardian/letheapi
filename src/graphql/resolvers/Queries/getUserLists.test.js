import { getUserLists } from './getUserLists';
import mockBlacklistedToken from '../../../database/models/BlacklistedToken';
import * as mockCheckAuth from '../checkAuth';
import mockGetUserListsLoader from '../../loaders';

jest.mock('../../../database/models/List');
jest.mock('../../../database/models/BlacklistedToken');
jest.mock('../../loaders');
jest.mock('../checkAuth');

describe('getUserLists tests', () => {
  it('Confirm load is called once', async () => {
    mockCheckAuth.isTokenValid.mockImplementationOnce(() => true);
    await getUserLists({ id: 'someUserId' }, 'args', {
      loaders: { getUserListsLoader: mockGetUserListsLoader },
      models: { BlacklistedToken: mockBlacklistedToken },
    });
    expect(mockGetUserListsLoader.load).toHaveBeenCalledTimes(1);
  });
});
