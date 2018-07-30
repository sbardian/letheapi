import { getLists } from './getLists';
import mockUser from '../../../database/models/User';
import mockList from '../../../database/models/List';
import mockGetListsLoader from '../../loaders';

jest.mock('../../../database/models/User');
jest.mock('../../../database/models/List');
jest.mock('../../loaders');

afterEach(() => mockGetListsLoader.load.mockClear());

// TODO: calledTimes? what?
describe('getLists tests', () => {
  it('Confirm load called twice, is Admin with no filters', async () => {
    mockList.find.mockImplementationOnce(() => ({
      limit: () => [
        {
          id: 'someListId1',
          title: 'someListTitle1',
          owner: 'someListOwnerId1',
        },
        {
          id: 'someListId2',
          title: 'someListTitle2',
          owner: 'someListOwnerId2',
        },
      ],
    }));
    await getLists('root', 'args', {
      models: { List: mockList, User: mockUser },
      loaders: { getListsLoader: mockGetListsLoader },
      user: { isAdmin: true },
    });
    expect(mockGetListsLoader.load).toHaveBeenCalledTimes(2);
  });
  it('Confirm load called twice, getOnlySelf with no filters', async () => {
    mockList.find.mockImplementationOnce(() => ({
      limit: () => [
        {
          id: 'someListId1',
          title: 'someListTitle1',
          owner: 'someListOwnerId1',
        },
        {
          id: 'someListId2',
          title: 'someListTitle2',
          owner: 'someListOwnerId2',
        },
      ],
    }));
    await getLists(
      'root',
      { userId: 'someUserId' },
      {
        models: { List: mockList, User: mockUser },
        loaders: { getListsLoader: mockGetListsLoader },
        user: { id: 'someUserId', isAdmin: false },
      },
    );
    expect(mockGetListsLoader.load).toHaveBeenCalledTimes(2);
  });
  it('Confirm load called twice, no userId, with no filters', async () => {
    mockList.find.mockImplementationOnce(() => ({
      limit: () => [
        {
          id: 'someListId1',
          title: 'someListTitle1',
          owner: 'someListOwnerId1',
        },
        {
          id: 'someListId2',
          title: 'someListTitle2',
          owner: 'someListOwnerId2',
        },
      ],
    }));
    await getLists('root', 'args', {
      models: { List: mockList, User: mockUser },
      loaders: { getListsLoader: mockGetListsLoader },
      user: { id: 'someUserId', isAdmin: false },
    });
    expect(mockGetListsLoader.load).toHaveBeenCalledTimes(2);
  });
  it('Confirm load called twice, not Admin and contains_title and id_is', async () => {
    mockList.find.mockImplementationOnce(() => ({
      limit: () => [
        {
          id: 'someListId1',
          title: 'someListTitle1',
          owner: 'someListOwnerId1',
        },
        {
          id: 'someListId2',
          title: 'someListTitle2',
          owner: 'someListOwnerId2',
        },
      ],
    }));
    await getLists(
      'root',
      { contains_title: 'someListTitle1', id_is: 'someListId2' },
      {
        models: { List: mockList, User: mockUser },
        loaders: { getListsLoader: mockGetListsLoader },
        user: { id: 'someUserId', isAdmin: false },
      },
    );
    expect(mockGetListsLoader.load).toHaveBeenCalledTimes(2);
  });
  it('Confirm load called twice, is Admin and contains_title and id_is', async () => {
    mockList.find.mockImplementationOnce(() => ({
      limit: () => [
        {
          id: 'someListId1',
          title: 'someListTitle1',
          owner: 'someListOwnerId1',
        },
        {
          id: 'someListId2',
          title: 'someListTitle2',
          owner: 'someListOwnerId2',
        },
      ],
    }));
    await getLists(
      'root',
      { contains_title: 'someListTitle1', id_is: 'someListId2' },
      {
        models: { List: mockList, User: mockUser },
        loaders: { getListsLoader: mockGetListsLoader },
        user: { id: 'someUserId', isAdmin: true },
      },
    );
    expect(mockGetListsLoader.load).toHaveBeenCalledTimes(2);
  });

  it('Confirm load called twice, is Admin and userId', async () => {
    mockList.find.mockImplementationOnce(() => ({
      limit: () => [
        {
          id: 'someListId1',
          title: 'someListTitle1',
          owner: 'someListOwnerId1',
        },
        {
          id: 'someListId2',
          title: 'someListTitle2',
          owner: 'someListOwnerId2',
        },
      ],
    }));
    await getLists(
      'root',
      { userId: 'someUserId' },
      {
        models: { List: mockList, User: mockUser },
        loaders: { getListsLoader: mockGetListsLoader },
        user: { id: 'someUserId', isAdmin: true },
      },
    );
    expect(mockGetListsLoader.load).toHaveBeenCalledTimes(2);
  });

  it('Returns an error: is not Admin, is not getOnlySelf', async () => {
    expect.assertions(1);
    try {
      await getLists(
        'root',
        { userId: 'someOtherUserId' },
        {
          models: { List: mockList, User: mockUser },
          loaders: { getListsLoader: mockGetListsLoader },
          user: { id: 'someUserId', isAdmin: false },
        },
      );
    } catch (err) {
      expect(err.message).toMatch(
        'You are only allowed to retrieve your own lists',
      );
    }
  });
});
