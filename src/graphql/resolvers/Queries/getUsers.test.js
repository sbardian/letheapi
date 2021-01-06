import { getUsers } from './getUsers';
import mockUser from '../../../database/models/User';
import mockGetUserLoader from '../../loaders';
import mockBlacklistedToken from '../../../database/models/BlacklistedToken';
import * as mockCheckAuth from '../checkAuth';

jest.mock('../../../database/models/BlacklistedToken');
jest.mock('../checkAuth');
jest.mock('../../../database/models/User');
jest.mock('../../loaders');

describe('getUsers tests', () => {
  it('Confirm load is called twice', async () => {
    mockCheckAuth.isTokenValid.mockImplementationOnce(() => true);
    mockUser.find.mockImplementationOnce(() => [
      { username: 'bob', email: 'bob@bob.com', isAdmin: false, lists: [] },
      { username: 'bob2', email: 'bob2@bob2.com', isAdmin: true, lists: [] },
    ]);
    await getUsers('root', 'args', {
      models: { User: mockUser, BlacklistedToken: mockBlacklistedToken },
      loaders: { getUserLoader: mockGetUserLoader },
      user: { isAdmin: true },
    });
    expect(mockGetUserLoader.load).toHaveBeenCalledTimes(2);
  });

  it('Returns error, user is not Admin', async () => {
    mockCheckAuth.isTokenValid.mockImplementationOnce(() => true);
    expect.assertions(1);
    try {
      await getUsers('root', 'args', {
        models: { User: mockUser, BlacklistedToken: mockBlacklistedToken },
        loaders: { getUserLoader: mockGetUserLoader },
        user: { isAdmin: false },
      });
    } catch (err) {
      expect(err.message).toMatch(
        'This is an Admin only function, please use getMyInfo query',
      );
    }
  });
});
