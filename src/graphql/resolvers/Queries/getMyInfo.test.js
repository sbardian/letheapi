import { getMyInfo } from './';
import mockGetMyInfoLoader from '../../loaders';

jest.mock('../../loaders');

describe('getMyInfo tests', () => {
  it('Returns a user object', async () => {
    await getMyInfo('root', 'args', {
      loaders: { getMyInfoLoader: mockGetMyInfoLoader },
      user: { id: 'someUserId' },
    });
    expect(mockGetMyInfoLoader.load).toHaveBeenCalledTimes(1);
  });
});
