import { AuthenticationError } from 'apollo-server';
import getStream from 'get-stream';
import { upload } from 'now-storage';
import { returnUsers } from '../../../database/utils';
import { isTokenValid } from '../checkAuth';

export const profileImageUpload = async (
  root,
  { file },
  { models: { User, BlacklistedToken }, user, token },
) => {
  if (!(await isTokenValid(token, BlacklistedToken))) {
    throw new AuthenticationError('Invalid token');
  }
  try {
    const { createReadStream, ...rest } = await file;
    const stream = createReadStream();
    const buffer = await getStream.buffer(stream);
    const { url } = await upload(process.env.NOW_TOKEN, {
      name: rest.filename,
      content: buffer,
    });
    return await returnUsers(
      await User.findByIdAndUpdate(
        user.id,
        {
          profileImageUrl: url,
        },
        { new: true },
      ),
    );
  } catch (error) {
    throw new Error('Failed to upload file.');
  }
};
