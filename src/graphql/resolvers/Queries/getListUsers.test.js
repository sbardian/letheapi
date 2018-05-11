import { getListUsers } from './';
import mockUser from '../../../database/models/User';

jest.mock('../../../database/models/User');

describe('getListUsers test', () => {
  it('Returns an array of users', async () => {
    mockUser.find.mockImplementationOnce(() => [
      {
        id: 'bobsId',
        username: 'bob',
        email: 'bob@bob.com',
      },
      {
        id: 'franksId',
        username: 'frank',
        email: 'frank@frank.com',
      },
    ]);
    expect(
      await getListUsers({ id: 'someListId' }, 'args', {
        models: { User: mockUser },
      }),
    ).toEqual(
      expect.arrayContaining([
        {
          id: 'bobsId',
          username: 'bob',
          email: 'bob@bob.com',
        },
        {
          id: 'franksId',
          username: 'frank',
          email: 'frank@frank.com',
        },
      ]),
    );
  });
});
