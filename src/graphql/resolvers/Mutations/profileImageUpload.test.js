import { testDatabase } from '../../../database/testDatabase';
import { profileImageUpload } from './profileImageUpload';
import User from '../../../database/models/User';
// import mockUser from '../../../database/models/User';
import { insertMockUsers } from '../../../database/mocks';
// import * as mockCheckAuth from '../checkAuth';

jest.mock('../checkAuth');
// jest.mock('../../../database/models/User');

let server;
let toUpdate;

beforeAll(async done => {
  server = await testDatabase();
  done();
});

afterAll(() => {
  server.mongoose.disconnect();
  server.mongoServer.stop();
});

beforeEach(async () => {
  const users = await User.insertMany(insertMockUsers(1));
  toUpdate = await User.findById(users[0].id);
});

afterEach(async () => {
  await User.deleteMany();
});

describe('Profile image upload tests', () => {
  // it('should upload an image', async () => {
  // TODO: write working test.
  // });

  it('should fail to upload an image', async () => {
    try {
      await profileImageUpload(
        {},
        { file: undefined },
        {
          models: { User },
          user: { id: toUpdate.id, isAdmin: false },
        },
      );
    } catch (error) {
      expect(error.message).toMatch('Failed to upload file.');
    }
  });
});
