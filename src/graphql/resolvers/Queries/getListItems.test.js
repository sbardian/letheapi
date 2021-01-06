import { getListItems } from './getListItems';
import mockGetListItemsLoader from '../../loaders';
import mockBlacklistedToken from '../../../database/models/BlacklistedToken';
import * as mockCheckAuth from '../checkAuth';

jest.mock('../checkAuth');

jest.mock('../../../database/models/Item');
jest.mock('../../../database/models/BlacklistedToken');
jest.mock('../../loaders');

describe('getListItems tests', () => {
  it('Confirm load is called once', async () => {
    mockCheckAuth.isTokenValid.mockImplementationOnce(() => true);
    await getListItems({ id: 'someListId' }, 'args', {
      loaders: { getListItemsLoader: mockGetListItemsLoader },
      models: { BlacklistedToken: mockBlacklistedToken },
    });
    expect(mockGetListItemsLoader.load).toHaveBeenCalledTimes(1);
  });
});
