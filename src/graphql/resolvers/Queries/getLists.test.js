import { getLists } from './getLists';
import mockUser from '../../../database/models/User';
import mockList from '../../../database/models/List';
import mockBlacklistedToken from '../../../database/models/BlacklistedToken';
import mockGetListsLoader from '../../loaders';
import * as mockCheckAuth from '../checkAuth';

jest.mock('../../../database/models/User');
jest.mock('../../../database/models/List');
jest.mock('../../../database/models/BlacklistedToken');
jest.mock('../../loaders');
jest.mock('../checkAuth');

afterEach(() => {
  mockGetListsLoader.load.mockClear();
  mockCheckAuth.getOnlySelf.mockClear();
});

// TODO: calledTimes? what?
describe('getLists tests', () => {
  it('Confirm load called twice, is Admin with no filters', async () => {
    mockCheckAuth.isTokenValid.mockImplementationOnce(() => true);
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
      models: {
        List: mockList,
        User: mockUser,
        BlacklistedToken: mockBlacklistedToken,
      },
      loaders: { getListsLoader: mockGetListsLoader },
      user: { isAdmin: true },
    });
    expect(mockGetListsLoader.load).toHaveBeenCalledTimes(2);
  });
  it('Confirm load called twice, getOnlySelf with no filters', async () => {
    mockCheckAuth.isTokenValid.mockImplementationOnce(() => true);
    mockCheckAuth.getOnlySelf.mockImplementationOnce(() => true);
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
        models: {
          List: mockList,
          User: mockUser,
          BlacklistedToken: mockBlacklistedToken,
        },
        loaders: { getListsLoader: mockGetListsLoader },
        user: { id: 'someUserId', isAdmin: false },
      },
    );
    expect(mockGetListsLoader.load).toHaveBeenCalledTimes(2);
  });
  it('Confirm load called twice, no userId, with no filters', async () => {
    mockCheckAuth.isTokenValid.mockImplementationOnce(() => true);
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
      models: {
        List: mockList,
        User: mockUser,
        BlacklistedToken: mockBlacklistedToken,
      },
      loaders: { getListsLoader: mockGetListsLoader },
      user: { id: 'someUserId', isAdmin: false },
    });
    expect(mockGetListsLoader.load).toHaveBeenCalledTimes(2);
  });
  it('Confirm load called twice, not Admin and contains_title and id_is', async () => {
    mockCheckAuth.isTokenValid.mockImplementationOnce(() => true);
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
        models: {
          List: mockList,
          User: mockUser,
          BlacklistedToken: mockBlacklistedToken,
        },
        loaders: { getListsLoader: mockGetListsLoader },
        user: { id: 'someUserId', isAdmin: false },
      },
    );
    expect(mockGetListsLoader.load).toHaveBeenCalledTimes(2);
  });
  it('Confirm load called twice, is Admin and contains_title and id_is', async () => {
    mockCheckAuth.isTokenValid.mockImplementationOnce(() => true);
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
        models: {
          List: mockList,
          User: mockUser,
          BlacklistedToken: mockBlacklistedToken,
        },
        loaders: { getListsLoader: mockGetListsLoader },
        user: { id: 'someUserId', isAdmin: true },
      },
    );
    expect(mockGetListsLoader.load).toHaveBeenCalledTimes(2);
  });

  it('Confirm load called twice, is Admin and userId', async () => {
    mockCheckAuth.isTokenValid.mockImplementationOnce(() => true);
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
        models: {
          List: mockList,
          User: mockUser,
          BlacklistedToken: mockBlacklistedToken,
        },
        loaders: { getListsLoader: mockGetListsLoader },
        user: { id: 'someUserId', isAdmin: true },
      },
    );
    expect(mockGetListsLoader.load).toHaveBeenCalledTimes(2);
  });

  it('Returns an error: is not Admin, is not getOnlySelf', async () => {
    mockCheckAuth.isTokenValid.mockImplementationOnce(() => true);
    mockCheckAuth.getOnlySelf.mockImplementation(() => false);
    expect.assertions(1);
    try {
      await getLists(
        'root',
        {
          userId: 'someOtherUserId',
        },
        {
          models: {
            List: mockList,
            User: mockUser,
            BlacklistedToken: mockBlacklistedToken,
          },
          loaders: { getListsLoader: mockGetListsLoader },
          user: { id: 'someUserIdfail', isAdmin: false },
        },
      );
    } catch (err) {
      expect(err.message).toMatch(
        'You are only allowed to retrieve your own lists',
      );
    }
  });
});
