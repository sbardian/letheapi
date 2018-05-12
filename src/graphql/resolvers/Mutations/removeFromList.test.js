import { removeFromList } from './';
import mockUser from '../../../database/models/User';
import mockList from '../../../database/models/List';

jest.mock('../../../database/models/User');
jest.mock('../../../database/models/List');

describe('removeFromList test', () => {
  it('Returns an error, not admin, not self', async () => {
    expect.assertions(1);
    mockList.findById.mockImplementationOnce(() => false);
    try {
      expect(
        await removeFromList(
          'root',
          { listId: 'someListId', userId: 'someOtherUserId' },
          {
            models: { User: mockUser, List: mockList },
            user: { id: 'someUserId', isAdmin: false },
          },
        ),
      );
    } catch (err) {
      expect(err.message).toMatch(
        'You do not have permission to remove this user from the list.',
      );
    }
  });
  // TODO: Needs to be implementation or end to end test
  it('Returns a user removed from a list, self', async () => {
    mockUser.findById
      .mockImplementationOnce(() => ({
        lists: [
          {
            id: 'someListId',
            title: 'someListTitle',
            owner: 'someListOwnerId',
          },
          {
            id: 'someListId2',
            title: 'someListTitle2',
            owner: 'someListOwnerId2',
          },
        ],
      }))
      .mockImplementationOnce(() => ({
        id: 'someUserId',
        username: 'someUser',
        email: 'someUser@someUser.com',
      }));
    mockList.findById.mockImplementationOnce(() => ({
      users: [
        {
          id: 'bobsId',
          username: 'bob',
          email: 'bob@bob.com',
        },
        {
          id: 'someUserId',
          username: 'someUser',
          email: 'someUser@someUser.com',
        },
      ],
    }));
    mockUser.findByIdAndUpdate.mockImplementationOnce(() => ({
      id: 'bobsId',
      username: 'bob',
      email: 'bob@bob.com',
    }));
    mockList.findByIdAndUpdate.mockImplementationOnce(() => [
      {
        id: 'someListId',
        title: 'someListTitle',
        owner: 'someListOwnerId',
      },
    ]);
    expect(
      await removeFromList(
        'root',
        { listId: 'someListId', userId: 'someUserId' },
        {
          models: { User: mockUser, List: mockList },
          user: { id: 'someUserId', isAdmin: false },
        },
      ),
    ).toEqual(
      expect.objectContaining({
        id: 'someUserId',
        username: 'someUser',
        email: 'someUser@someUser.com',
      }),
    );
  });
});
