import bcrypt from 'bcrypt';
import { authorizeLogin } from './authorizeLogin';
import mockUser from '../../database/models/User';
import { config } from '../../config';

jest.mock('../../database/models/User');

describe('Login tests', () => {
  it('Returns a token', async () => {
    const passHash = await bcrypt.hash('bobspassword', 10);
    mockUser.findOne.mockImplementationOnce(() => ({
      id: 'someId',
      email: 'bob@bob.com',
      username: 'bob',
      password: passHash,
    }));
    expect(await authorizeLogin('bob', 'bobspassword', mockUser)).toEqual(
      expect.objectContaining({ token: expect.any(String) }),
    );
  });
  it('Returns an error, user not found', async () => {
    mockUser.findOne.mockImplementationOnce(() => undefined);
    expect(await authorizeLogin('bob', 'bobspassword', mockUser)).toEqual(
      expect.any(Error),
    );
  });
  it('Returns an error, bad password', async () => {
    mockUser.findOne.mockImplementationOnce(() => ({
      id: 'someId',
      email: 'bob@bob.com',
      username: 'bob',
      password: 'wrong',
    }));
    expect(await authorizeLogin('bob', 'bobspassword', mockUser)).toEqual(
      expect.any(Error),
    );
  });
});
