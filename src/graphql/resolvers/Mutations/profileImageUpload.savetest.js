import fs from 'fs';
import mockedNow from 'now-storage';
import createDB from '../../../database/database';
import { profileImageUpload } from './profileImageUpload';
import User from '../../../database/models/User';
import { insertMockUsers } from '../../../database/mocks';
import { returnUsers } from '../../../database/utils';
import * as mockCheckAuth from '../checkAuth';

const PROFILE_IMAGE_URL = 'http://someFakeUrl.com/amazonicon.png';

const spyUpload = jest.spyOn(mockedNow, 'upload');

jest.mock('../checkAuth');

let server;
let toUpdate;

beforeAll(async (done) => {
  server = await createDB();
  done();
});

afterAll(() => {
  server.mongoose.disconnect();
  // server.mongoServer.stop();
});

beforeEach(async () => {
  const users = await User.insertMany(insertMockUsers(1));
  toUpdate = await User.findById(users[0].id);
});

afterEach(async () => {
  await User.deleteMany();
});

describe('Profile image upload tests', () => {
  it('should upload a file', async () => {
    mockCheckAuth.isTokenValid.mockImplementationOnce(() => true);
    const imageStream = fs.createReadStream('src/test-assets/amazonicon.png');
    await profileImageUpload(
      {},
      { file: { createReadStream: () => imageStream } },
      { models: { User }, user: returnUsers(toUpdate) },
    );
  });
  it('should upload an image', async () => {
    mockCheckAuth.isTokenValid.mockImplementationOnce(() => true);
    spyUpload.mockImplementationOnce(() => ({
      url: PROFILE_IMAGE_URL,
    }));
    const imageStream = fs.createReadStream('src/test-assets/amazonicon.png');

    const userWithProfileImage = await profileImageUpload(
      {},
      { file: { createReadStream: () => imageStream } },
      { models: { User }, user: returnUsers(toUpdate) },
    );
    expect(userWithProfileImage).toEqual({
      ...returnUsers(toUpdate),
      profileImageUrl: PROFILE_IMAGE_URL,
    });
  });

  it('should fail to upload an image', async () => {
    mockCheckAuth.isTokenValid.mockImplementationOnce(() => true);
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
