import { getUsers } from './';
import mockUser from '../../../database/models/User';

jest.mock('../../../database/models/User');

describe('getUsers tests', () => {
  it('Returns array of users', async () => {
    mockUser.find.mockImplementationOnce(() => [
      { username: 'bob', email: 'bob@bob.com', isAdmin: false, lists: [] },
      { username: 'bob2', email: 'bob2@bob2.com', isAdmin: true, lists: [] },
    ]);
    expect(await getUsers({ isAdmin: true }, mockUser)).toEqual(
      expect.any(Array),
    );
  });
  it('Returns error, user is not Admin', async () => {
    expect(await getUsers({ isAdmin: false }, mockUser)).toEqual(
      expect.any(Error),
    );
  });
});
