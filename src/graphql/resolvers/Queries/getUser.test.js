import { getUser } from './';
import mockUser from '../../../database/models/User';

jest.mock('../../../database/models/User');

describe('Test getUser', () => {
  it('Returns a user', async () => {
    mockUser.findById.mockImplementationOnce(() => ({
      id: 'bobsId',
      username: 'bob',
      email: 'bob@bob.com',
    }));
    expect(
      await getUser('root', 'args', {
        models: { User: mockUser },
        user: { isAdmin: true },
      }),
    ).toEqual(
      expect.objectContaining({
        id: 'bobsId',
        username: 'bob',
        email: 'bob@bob.com',
      }),
    );
  });
  it('Returns an error, user is not Admin', async () => {
    expect.assertions(1);
    try {
      await getUser('root', 'args', {
        models: { User: mockUser },
        user: { isAdmin: false },
      });
    } catch (err) {
      expect(err.message).toMatch(
        'This is an Admin only function, please use getMyInfo query',
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
          user: { isAdmin: true },
        },
      );
    } catch (err) {
      expect(err.message).toMatch('User ID someUserId not found');
    }
  });
});
