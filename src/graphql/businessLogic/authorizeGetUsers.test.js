import { authorizeGetUsers } from './authorizeGetUsers';
import mockUser from '../../database/models/User';

jest.mock('../../database/models/User');

describe('authorizeGetUsers tests', () => {
  it('Returns array of users', async () => {
    mockUser.find.mockImplementationOnce(() => [
      { username: 'bob', email: 'bob@bob.com', isAdmin: false, lists: [] },
      { username: 'bob2', email: 'bob2@bob2.com', isAdmin: true, lists: [] },
    ]);
    expect(await authorizeGetUsers({ isAdmin: true }, mockUser)).toEqual(
      expect.any(Array),
    );
  });
  it('Returns error, user is not Admin', async () => {
    expect(await authorizeGetUsers({ isAdmin: false }, mockUser)).toEqual(
      expect.any(Error),
    );
  });
});
