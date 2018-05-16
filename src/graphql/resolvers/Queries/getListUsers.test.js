import { getListUsers } from './';
import mockGetListUsersLoader from '../../loaders/getListUsersLoader';

jest.mock('../../loaders/getListUsersLoader');

describe('getListUsers test', () => {
  it('Confirm load is called once', async () => {
    mockGetListUsersLoader.load.mockImplementationOnce(() => true);
    await getListUsers({ id: 'someListId' }, 'args', {
      loaders: { getListUsersLoader: mockGetListUsersLoader },
    });
    expect(mockGetListUsersLoader.load).toHaveBeenCalledTimes(1);
  });
});
