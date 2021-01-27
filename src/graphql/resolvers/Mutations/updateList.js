import { AuthenticationError } from 'apollo-server';
import { v4 as uuidv4 } from 'uuid';
import { ownerOfList, isTokenValid } from '../checkAuth';

export const updateList = async (
  root,
  { listId, title, file },
  { models: { List, BlacklistedToken }, bucket, user, token },
) => {
  if (!(await isTokenValid(token, BlacklistedToken))) {
    throw new AuthenticationError('Invalid token');
  } else if (ownerOfList(user, listId, List)) {
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
            resolve(newFilename);
          });
        });

      const listImageUrl = await uploadFile();

      return List.findByIdAndUpdate(
        listId,
        { title, listImageUrl },
        { new: true },
      );
    } catch (error) {
      throw new Error('Failed to upload file.');
    }
  }
  // return List.findByIdAndUpdate(
  //   listId,
  //   { title, listImageUrl },
  //   { new: true },
  // );

  throw new Error('You do not have permission to update this list.');
};
