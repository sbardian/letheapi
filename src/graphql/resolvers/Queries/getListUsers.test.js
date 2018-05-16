import { getListUsers } from './';
import mockGetListUsersLoader from '../../loaders';

jest.mock('../../loaders');

describe('getListUsers test', () => {
  it('Confirm load is called once', async () => {
    mockGetListUsersLoader.load.mockImplementationOnce(() => true);
    await getListUsers({ id: 'someListId' }, 'args', {
      loaders: { getListUsersLoader: mockGetListUsersLoader },
    });
    expect(mockGetListUsersLoader.load).toHaveBeenCalledTimes(1);
  });
});
