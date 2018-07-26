import { getListUsers } from './getListUsers';
import mockGetListUsersLoader from '../../loaders';

jest.mock('../../loaders');

describe('getListUsers test', () => {
  it('Confirm load is called once', async () => {
    await getListUsers({ id: 'someListId' }, 'args', {
      loaders: { getListUsersLoader: mockGetListUsersLoader },
    });
    expect(mockGetListUsersLoader.load).toHaveBeenCalledTimes(1);
  });
});
