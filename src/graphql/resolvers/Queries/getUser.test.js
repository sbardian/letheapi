import { getUser } from './';
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
      });
    } catch (err) {
      expect(err.message).toMatch(
        'You must be a valid user to perform this query.',
      );
    }
  });
  it('Returns an error, user is not found', async () => {
    mockUser.findById.mockImplementationOnce(() => undefined);
    expect.assertions(1);
    try {
      await getUser(
        'root',
        { userId: 'someUserId' },
        {
          models: { User: mockUser },
          loaders: { getUserLoader: mockGetUserLoader },
          user: { isAdmin: true },
        },
      );
    } catch (err) {
      expect(err.message).toMatch('User ID someUserId not found');
    }
  });
});
