import { getLists } from './';
import mockUser from '../../../database/models/User';
import mockList from '../../../database/models/List';

jest.mock('../../../database/models/User');
jest.mock('../../../database/models/List');

describe('getLists tests', () => {
  it('Returns an array of lists, is Admin with no filters', async () => {
    mockList.find.mockImplementationOnce(() => ({
      limit: () => [
        {
          id: 'someListId1',
          title: 'someListTitle1',
          owner: 'someListOwnerId1',
        },
        {
          id: 'someListId2',
          title: 'someListTitle2',
          owner: 'someListOwnerId2',
        },
      ],
    }));
    expect(
      await getLists('root', 'args', {
        models: { List: mockList, User: mockUser },
        user: { isAdmin: true },
      }),
    ).toEqual(
      expect.arrayContaining([
        {
          id: 'someListId1',
          title: 'someListTitle1',
          owner: 'someListOwnerId1',
        },
        {
          id: 'someListId2',
          title: 'someListTitle2',
          owner: 'someListOwnerId2',
        },
      ]),
    );
  });
});
