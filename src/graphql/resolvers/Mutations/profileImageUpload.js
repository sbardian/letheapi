import getStream from 'get-stream';
import { upload } from 'now-storage';
import { returnUsers } from '../../../database/utils';

export const profileImageUpload = async (
  root,
  { file },
  { models: { User }, user },
) => {
  try {
    const { stream, ...rest } = await file;
    const buffer = await getStream.buffer(stream);
    const { url } = await upload(process.env.NOW_TOKEN, {
      name: rest.filename,
      content: buffer,
    });
    return returnUsers(
      await User.findByIdAndUpdate(user.id, {
        profileImageUrl: url,
      }),
    );
  } catch (error) {
    throw new Error('Failed to upload file', error);
  }
};
