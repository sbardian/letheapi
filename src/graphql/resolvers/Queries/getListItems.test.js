import { getListItems } from './';
import mockItem from '../../../database/models/Item';

jest.mock('../../../database/models/Item');

describe('getListItems tests', () => {
  it('Returns an array of items, no limit', async () => {
    mockItem.find.mockImplementationOnce(() => ({
      limit: () => [
        {
          title: 'someItemTitle1',
          list: 'someListId1',
          creator: 'someCreatorId1',
        },
        {
          title: 'someItemTitle2',
          list: 'someListId2',
          creator: 'someCreatorId2',
        },
        {
          title: 'someItemTitle3',
          list: 'someListId3',
          creator: 'someCreatorId3',
        },
      ],
    }));
    expect(
      await getListItems({ id: 'someListId' }, 'noLimit', {
        models: { Item: mockItem },
      }),
    ).toEqual(
      expect.arrayContaining([
        {
          title: 'someItemTitle3',
          list: 'someListId3',
          creator: 'someCreatorId3',
        },
      ]),
    );
  });
});
