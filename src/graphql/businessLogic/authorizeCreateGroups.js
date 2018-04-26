import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { returnGroups } from '../../database/utils';
import { JWT_SECRET } from '../../config/config';

export const authorizeCreateGroups = async (user, groups, Group, User) =>
  // TODO implement user check?
  (await Group.create(
    groups.map(({ title }) => ({
      title: title,
      owner: user.username,
      users: [{ username: user.username }],
      items: [],
    })),
  )).map(returnGroups);
