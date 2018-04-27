import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { returnGroups } from '../../database/utils';
import { JWT_SECRET } from '../../config/config';

export const authorizeCreateGroups = async ({ id }, groups, Group, User) => {
  // TODO implement user check?
  return (await Group.create(
    groups.map(({ title }) => ({
      title: title,
      owner: id,
      users: [{ id }],
      items: [],
    })),
  )).map(returnGroups);
};
