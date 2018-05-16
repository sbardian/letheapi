import { getUserLists } from './';
import mockGetUserListsLoader from '../../loaders/getUserListsLoader';

jest.mock('../../../database/models/List');
jest.mock('../../loaders/getUserListsLoader');

describe('getUserLists tests', () => {
  it('Confirm load is called once', async () => {
    await getUserLists({ id: 'someUserId' }, 'args', {
      loaders: { getUserListsLoader: mockGetUserListsLoader },
    });
    expect(mockGetUserListsLoader.load).toHaveBeenCalledTimes(1);
  });
});
