import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { returnUsers } from '../../database/utils';
import { JWT_SECRET } from '../../config/config';

export const authorizeGetGroupsUsers = async (
  { id },
  args,
  { models: { User } },
) => (await User.find({ 'groups.id': id })).map(returnUsers);
