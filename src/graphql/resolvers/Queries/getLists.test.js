import { getLists } from './';
import mockUser from '../../../database/models/User';
import mockList from '../../../database/models/List';

jest.mock('../../../database/models/User');
jest.mock('../../../database/models/List');

describe('getLists tests', () => {
  it('Returns an array of lists, is Admin with no filters', async () => {
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
    expect(
      await getLists('root', 'args', {
        models: { List: mockList, User: mockUser },
        user: { isAdmin: true },
      }),
    ).toEqual(
      expect.arrayContaining([
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
      ]),
    );
  });
  it('Returns an array of lists, getOnlySelf with no filters', async () => {
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
    expect(
      await getLists(
        'root',
        { userId: 'someUserId' },
        {
          models: { List: mockList, User: mockUser },
          user: { id: 'someUserId', isAdmin: false },
        },
      ),
    ).toEqual(
      expect.arrayContaining([
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
      ]),
    );
  });
  it('Returns an array of lists, no userId, with no filters', async () => {
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
    expect(
      await getLists('root', 'args', {
        models: { List: mockList, User: mockUser },
        user: { id: 'someUserId', isAdmin: false },
      }),
    ).toEqual(
      expect.arrayContaining([
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
      ]),
    );
  });
  it('Returns an array of one list, not Admin and contains_title and id_is', async () => {
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
    expect(
      await getLists(
        'root',
        { contains_title: 'someListTitle1', id_is: 'someListId2' },
        {
          models: { List: mockList, User: mockUser },
          user: { id: 'someUserId', isAdmin: false },
        },
      ),
    ).toEqual(
      expect.arrayContaining([
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
      ]),
    );
  });
  it('Returns an array of one list, is Admin and contains_title and id_is', async () => {
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
    expect(
      await getLists(
        'root',
        { contains_title: 'someListTitle1', id_is: 'someListId2' },
        {
          models: { List: mockList, User: mockUser },
          user: { id: 'someUserId', isAdmin: true },
        },
      ),
    ).toEqual(
      expect.arrayContaining([
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
      ]),
    );
  });
  it('Returns an error: is not Admin, is not getOnlySelf', async () => {
    expect.assertions(1);
    try {
      await getLists(
        'root',
        { userId: 'someOtherUserId' },
        {
          models: { List: mockList, User: mockUser },
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
