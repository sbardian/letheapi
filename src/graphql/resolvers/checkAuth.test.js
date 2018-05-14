import {
  userOfListByItemId,
  userOfListByListId,
  getOnlySelf,
  ownerOfList,
} from './checkAuth';
import mockUser from '../../database/models/User';
import mockList from '../../database/models/List';

jest.mock('../../database/models/User');
jest.mock('../../database/models/List');

describe('checkAuth tests', () => {
  it('Returns true, userOfListByItemId', async () => {
    mockUser.findById.mockImplementationOnce(() => ({ lists: ['someListId'] }));
    mockList.find.mockImplementationOnce(() => ({
      id: 'someListId',
    }));
    expect(
      await userOfListByItemId('user', 'itemId', mockUser, mockList),
    ).toBeTruthy();
  });
  it('Returns false, userOfListByItemId', async () => {
    mockUser.findById.mockImplementationOnce(() => ({ lists: ['someListId'] }));
    mockList.find.mockImplementationOnce(() => ({
      id: 'someWrongListId',
    }));
    expect(
      await userOfListByItemId('user', 'itemId', mockUser, mockList),
    ).not.toBeTruthy();
  });
  it('Returns true, userOfListByListId', async () => {
    mockUser.findById.mockImplementationOnce(() => ({ lists: ['someListId'] }));
    expect(
      await userOfListByListId('user', 'someListId', mockUser),
    ).toBeTruthy();
  });
  it('Returns false, userOfListByListId', async () => {
    mockUser.findById.mockImplementationOnce(() => ({ lists: ['someListId'] }));
    expect(
      await userOfListByListId('user', 'someWrongListId', mockUser),
    ).not.toBeTruthy();
  });
  it('Returns true, getOnlySelf', () => {
    expect(getOnlySelf({ id: 'someUserId' }, 'someUserId')).toBeTruthy();
  });
  it('Returns false, getOnlySelf', () => {
    expect(
      getOnlySelf({ id: 'someWrongUserId' }, 'someUserId'),
    ).not.toBeTruthy();
  });
  it('Returns true, ownerOfList', async () => {
    mockList.findById.mockImplementationOnce(() => ({
      owner: 'someUserId',
    }));
    expect(
      await ownerOfList({ id: 'someUserId' }, 'listId', mockList),
    ).toBeTruthy();
  });
  it('Returns false, ownerOfList', async () => {
    mockList.findById.mockImplementationOnce(() => ({
      owner: 'someWrongUserId',
    }));
    expect(
      await ownerOfList({ id: 'someUserId' }, 'listId', mockList),
    ).not.toBeTruthy();
  });
});
