import { authorizeSignup } from './authorizeSignup';
import mockUser from '../../database/models/User';
import { config } from '../../config';

jest.mock('../../database/models/User');

describe('Sign up tests', () => {
  it('Returns a token', async () => {
    mockUser.findOne.mockImplementationOnce(() => false);
    mockUser.create.mockImplementationOnce(() => ({ id: 'SomeUserId' }));
    expect(
      await authorizeSignup('bob', 'bob@bob.com', 'bobspassword', mockUser),
    ).toEqual(expect.objectContaining({ token: expect.any(String) }));
  });
  it('Returns an error', async () => {
    mockUser.findOne.mockImplementationOnce(() => true);
    expect(
      authorizeSignup('bob', 'bob@bob.com', 'bobspassword', mockUser),
    ).resolves.toEqual(expect.any(Error));
  });
});
