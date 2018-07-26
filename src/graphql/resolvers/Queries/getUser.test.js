import { getUser } from './getUser';
import mockUser from '../../../database/models/User';
import mockGetUserLoader from '../../loaders';

jest.mock('../../../database/models/User');
jest.mock('../../loaders');

describe('Test getUser', () => {
  it('Returns a user', async () => {
    mockGetUserLoader.load.mockImplementationOnce(() => true);
    mockUser.findById.mockImplementationOnce(() => ({
      id: 'bobsId',
      username: 'bob',
      email: 'bob@bob.com',
    }));
    await getUser('root', 'args', {
      models: { User: mockUser },
      loaders: { getUserLoader: mockGetUserLoader },
      user: { isAdmin: true },
    });
    expect(mockGetUserLoader.load).toHaveBeenCalledTimes(1);
  });
  it('Returns an error, user is not Admin', async () => {
    expect.assertions(1);
    try {
      await getUser('root', 'args', {
        models: { User: mockUser },
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
