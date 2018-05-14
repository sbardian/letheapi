import { getUsers } from './';
import mockUser from '../../../database/models/User';
// import { resolveSoa } from 'dns';

jest.mock('../../../database/models/User');

describe('getUsers tests', () => {
  it('Returns array of users', async () => {
    mockUser.find.mockImplementationOnce(() => [
      { username: 'bob', email: 'bob@bob.com', isAdmin: false, lists: [] },
      { username: 'bob2', email: 'bob2@bob2.com', isAdmin: true, lists: [] },
    ]);
    expect(
      await getUsers('root', 'args', {
        models: { User: mockUser },
        user: { isAdmin: true },
      }),
    ).toEqual(expect.any(Array));
  });

  it('Returns error, user is not Admin', async () => {
    expect.assertions(1);
    try {
      await getUsers('root', 'args', {
        models: { User: mockUser },
        user: { isAdmin: false },
      });
    } catch (err) {
      expect(err.message).toMatch(
        'This is an Admin only function, please use getMyInfo query',
      );
    }
  });
});
