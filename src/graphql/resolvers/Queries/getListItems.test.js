import { getListItems } from './';
import mockItem from '../../../database/models/Item';
import mockGetListItemsLoader from '../../loaders';

jest.mock('../../../database/models/Item');
jest.mock('../../loaders');

describe('getListItems tests', () => {
  it('Confirm load is called once', async () => {
    await getListItems({ id: 'someListId' }, 'args', {
      loaders: { getListItemsLoader: mockGetListItemsLoader },
    });
    expect(mockGetListItemsLoader.load).toHaveBeenCalledTimes(1);
  });
});
