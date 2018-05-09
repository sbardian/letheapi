import { authorizeGetUserLists } from './authorizeGetUserLists';
import mockList from '../../database/models/List';

jest.mock('../../database/models/List');

describe('GetUserLists tests', () => {
  it('Returns a users lists ', async () => {
    const list = [
      {
        id: 'someListId',
        title: 'Some List Title',
        owner: 'someOwnerId',
      },
    ];
    mockList.find.mockImplementationOnce(() => list);
    expect(
      await authorizeGetUserLists('someUserId', {}, mockList),
    ).toMatchObject(list);
  });
  it('Returns empty array, no lists found', async () => {
    const list = [];
    mockList.find.mockImplementationOnce(() => list);
    expect(
      await authorizeGetUserLists('someUserId', {}, mockList),
    ).toHaveLength(0);
  });
});
