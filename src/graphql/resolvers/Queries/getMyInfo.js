import { returnUsers } from '../../../database/utils';

export const getMyInfo = async (
  root,
  args,
  { loaders: { getMyInfoLoader }, user },
) => getMyInfoLoader.load(user.id);
