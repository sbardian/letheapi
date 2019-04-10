import fs from 'fs';
import mockedNow from 'now-storage';
import createDB from '../../../database/database';
import { profileImageUpload } from './profileImageUpload';
import User from '../../../database/models/User';
import { insertMockUsers } from '../../../database/mocks';
import { returnUsers } from '../../../database/utils';

const PROFILE_IMAGE_URL = 'http://someFakeUrl.com/amazonicon.png';

const spyUpload = jest.spyOn(mockedNow, 'upload');

let server;
let toUpdate;

beforeAll(async done => {
  server = await createDB();
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
  it('should upload an image', async () => {
    spyUpload.mockImplementationOnce(() => ({
      url: PROFILE_IMAGE_URL,
    }));
    const imageStream = await fs.createReadStream(
      'src/test-assets/amazonicon.png',
    );
    const userWithProfileImage = await profileImageUpload(
      {},
      { file: { stream: imageStream } },
      { models: { User }, user: returnUsers(toUpdate) },
    );
    expect(userWithProfileImage).toEqual({
      ...returnUsers(toUpdate),
      profileImageUrl: PROFILE_IMAGE_URL,
    });
  });

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
