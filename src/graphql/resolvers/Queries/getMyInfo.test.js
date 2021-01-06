import { getMyInfo } from './getMyInfo';
import mockGetMyInfoLoader from '../../loaders';
import mockBlacklistedToken from '../../../database/models/BlacklistedToken';
import * as mockCheckAuth from '../checkAuth';

jest.mock('../../../database/models/BlacklistedToken');
jest.mock('../checkAuth');
jest.mock('../../loaders');

describe('getMyInfo tests', () => {
  it('Returns a user object', async () => {
    mockCheckAuth.isTokenValid.mockImplementationOnce(() => true);
    await getMyInfo('root', 'args', {
      loaders: { getMyInfoLoader: mockGetMyInfoLoader },
      models: { BlacklistedToken: mockBlacklistedToken },
      user: { id: 'someUserId' },
    });
    expect(mockGetMyInfoLoader.load).toHaveBeenCalledTimes(1);
  });
});
