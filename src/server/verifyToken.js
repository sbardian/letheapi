import { AuthenticationError } from 'apollo-server';
import jwt from 'jsonwebtoken';
import { config } from '../config';

export const verifyToken = token => {
  try {
    return jwt.verify(token, config.sessionSecret);
  } catch (e) {
    throw new AuthenticationError('Authentication failed.');
  }
};
