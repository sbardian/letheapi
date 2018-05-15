import { getListItems } from './';
import mockItem from '../../../database/models/Item';
import mockGetListItemsLoader from '../../loaders/getListItemsLoader';

jest.mock('../../../database/models/Item');
jest.mock('../../loaders/getListItemsLoader');

describe('getListItems tests', () => {
  it('Confirm load is called once', async () => {
    mockGetListItemsLoader.load.mockImplementationOnce(() => true);
    await getListItems({ id: 'someListId' }, 'args', {
      loaders: { getListItemsLoader: mockGetListItemsLoader },
    });
    expect(mockGetListItemsLoader.load).toHaveBeenCalledTimes(1);
  });
});
