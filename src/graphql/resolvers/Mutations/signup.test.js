import { signup } from './';
import mockUser from '../../../database/models/User';
import { config } from '../../../config';

jest.mock('../../../database/models/User');

describe('Sign up tests', () => {
  it('Returns a token', async () => {
    mockUser.findOne.mockImplementationOnce(() => false);
    mockUser.create.mockImplementationOnce(() => ({ id: 'SomeUserId' }));
    expect(
      await signup(
        'root',
        { signupInput: { username: 'bob', password: 'bobspassword' } },
        { models: { User: mockUser } },
      ),
    ).toEqual(expect.objectContaining({ token: expect.any(String) }));
  });
  it('Returns an error', async () => {
    expect.assertions(1);
    mockUser.findOne.mockImplementationOnce(() => true);
    try {
      await signup(
        'root',
        { signupInput: { username: 'bob', password: 'bobspassword' } },
        { models: { User: mockUser } },
      );
    } catch (err) {
      expect(err.message).toMatch('Email or username already exists');
    }
  });
});
