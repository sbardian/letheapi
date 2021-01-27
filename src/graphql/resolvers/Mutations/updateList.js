import { AuthenticationError } from 'apollo-server';
import { v4 as uuidv4 } from 'uuid';
import { returnLists } from '../../../database/utils/utils';
import { ownerOfList, isTokenValid } from '../checkAuth';

export const updateList = async (
  root,
  { listId, title, file },
  { models: { List, BlacklistedToken }, bucket, user, token },
) => {
  if (!(await isTokenValid(token, BlacklistedToken))) {
    throw new AuthenticationError('Invalid token');
  } else if (ownerOfList(user, listId, List)) {
    const orgList = returnLists(await List.findById(listId));
    if (file) {
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

        return returnLists(
          await List.findByIdAndUpdate(
            listId,
            { title: title || orgList.title, listImageUrl },
            { new: true },
          ),
        );
      } catch (error) {
        throw new Error('Failed to upload file.');
      }
    } else if (title) {
      return returnLists(
        await List.findByIdAndUpdate(
          listId,
          { title, listImageUrl: orgList.listImageUrl },
          { new: true },
        ),
      );
    }
  }

  throw new Error('You do not have permission to update this list.');
};
