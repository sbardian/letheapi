import { getMyInfo } from './';
import mockUser from '../../../database/models/User';

jest.mock('../../../database/models/User');

describe('getMyInfo tests', () => {
  it('Returns a user object', async () => {
    mockUser.findById.mockImplementationOnce(() => ({
      id: 'bobsId',
      username: 'bob',
      email: 'bob@bob.com',
    }));
    expect(
      await getMyInfo('root', 'args', {
        models: { User: mockUser },
        user: { id: 'someUserId' },
      }),
    ).toEqual(
      expect.objectContaining({
        id: 'bobsId',
        username: 'bob',
        email: 'bob@bob.com',
      }),
    );
  });
});
