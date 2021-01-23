import { AuthenticationError } from 'apollo-server';
import { v4 as uuidv4 } from 'uuid';
import { returnUsers } from '../../../database/utils';
import { isTokenValid } from '../checkAuth';

export const profileImageUpload = async (
  root,
  { file },
  { models: { User, BlacklistedToken }, user, bucket, token },
) => {
  if (!(await isTokenValid(token, BlacklistedToken))) {
    throw new AuthenticationError('Invalid token');
  }
  try {
    const { filename, mimetype, createReadStream } = await file;
    const ext = filename.slice(filename.lastIndexOf('.'));
    const uniqueFilename = uuidv4();
    const newFilename = uniqueFilename + ext;

    const fileUpload = bucket.file(newFilename);

    const uploadFile = () =>
      new Promise((resolve, reject) => {
        const stream = createReadStream().pipe(
          fileUpload.createWriteStream({
            metadata: {
              contentType: mimetype,
            },
          }),
        );

        stream.on('error', (error) => {
          reject(new Error('an error occured uploading file: ', error));
        });

        stream.on('finish', () => {
          const url = `https://${bucket.name}/${fileUpload.name}`;
          resolve(url);
        });
      });

    const profileImageUrl = await uploadFile();

    return returnUsers(
      await User.findByIdAndUpdate(
        user.id,
        {
          profileImageUrl,
        },
        { new: true },
      ),
    );
  } catch (error) {
    throw new Error('Failed to upload file.');
  }
};
