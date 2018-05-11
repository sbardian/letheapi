import { getUserLists } from './';
import mockList from '../../../database/models/List';

jest.mock('../../../database/models/List');

describe('getUserLists tests', () => {
  it('Returns an array of user lists', async () => {
    mockList.find.mockImplementationOnce(() => [
      {
        id: 'someListId',
        title: 'someListTitle',
        owner: 'someListOwnerId',
      },
    ]);
    expect(
      await getUserLists({ id: 'someUserId' }, 'args', {
        models: { List: mockList },
      }),
    ).toEqual(
      expect.arrayContaining([
        {
          id: 'someListId',
          title: 'someListTitle',
          owner: 'someListOwnerId',
        },
      ]),
    );
  });
});
