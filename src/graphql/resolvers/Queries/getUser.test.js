import { getUser } from './getUser';
import mockUser from '../../../database/models/User';
import mockGetUserLoader from '../../loaders';
import mockBlacklistedToken from '../../../database/models/BlacklistedToken';
import * as mockCheckAuth from '../checkAuth';

jest.mock('../../../database/models/BlacklistedToken');
jest.mock('../../../database/models/User');
jest.mock('../checkAuth');
jest.mock('../../loaders');

describe('Test getUser', () => {
  it('Returns a user', async () => {
    mockGetUserLoader.load.mockImplementationOnce(() => true);
    mockCheckAuth.isTokenValid.mockImplementationOnce(() => true);
    mockUser.findById.mockImplementationOnce(() => ({
      id: 'bobsId',
      username: 'bob',
      email: 'bob@bob.com',
    }));
    await getUser('root', 'args', {
      models: { User: mockUser, BlacklistedToken: mockBlacklistedToken },
      loaders: { getUserLoader: mockGetUserLoader },
      user: { isAdmin: true },
    });
    expect(mockGetUserLoader.load).toHaveBeenCalledTimes(1);
  });
  it('Returns an error, user is not Admin', async () => {
    mockCheckAuth.isTokenValid.mockImplementationOnce(() => true);
    expect.assertions(1);
    try {
      await getUser('root', 'args', {
        models: { User: mockUser, BlacklistedToken: mockBlacklistedToken },
        loaders: { getUserLoader: mockGetUserLoader },
        user: { isAdmin: false },
      });
    } catch (err) {
      expect(err.message).toMatch(
        'This is an Admin only function, please use getMyInfo query.',
      );
    }
  });
});
