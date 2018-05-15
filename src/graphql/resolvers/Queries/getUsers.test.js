import { getUsers } from './';
import mockUser from '../../../database/models/User';
import mockGetUserLoader from '../../loaders/getUserLoader';

jest.mock('../../../database/models/User');
jest.mock('../../loaders/getUserLoader');

describe('getUsers tests', () => {
  it('Confirm load is called twice', async () => {
    mockUser.find.mockImplementationOnce(() => [
      { username: 'bob', email: 'bob@bob.com', isAdmin: false, lists: [] },
      { username: 'bob2', email: 'bob2@bob2.com', isAdmin: true, lists: [] },
    ]);
    mockGetUserLoader.load.mockImplementationOnce(() => true);
    await getUsers('root', 'args', {
      models: { User: mockUser },
      loaders: { getUserLoader: mockGetUserLoader },
      user: { isAdmin: true },
    });
    expect(mockGetUserLoader.load).toHaveBeenCalledTimes(2);
  });

  it('Returns error, user is not Admin', async () => {
    mockGetUserLoader.load.mockImplementationOnce(() => true);
    expect.assertions(1);
    try {
      await getUsers('root', 'args', {
        models: { User: mockUser },
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
