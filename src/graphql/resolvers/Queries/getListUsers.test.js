import { getListUsers } from './getListUsers';
import mockGetListUsersLoader from '../../loaders';
import mockBlacklistedToken from '../../../database/models/BlacklistedToken';
import * as mockCheckAuth from '../checkAuth';

jest.mock('../../../database/models/BlacklistedToken');
jest.mock('../checkAuth');
jest.mock('../../loaders');

describe('getListUsers test', () => {
  it('Confirm load is called once', async () => {
    mockCheckAuth.isTokenValid.mockImplementationOnce(() => true);
    await getListUsers({ id: 'someListId' }, 'args', {
      loaders: { getListUsersLoader: mockGetListUsersLoader },
      models: { BlacklistedToken: mockBlacklistedToken },
    });
    expect(mockGetListUsersLoader.load).toHaveBeenCalledTimes(1);
  });
});
