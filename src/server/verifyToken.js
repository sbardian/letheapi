import { AuthenticationError } from 'apollo-server';
import jwt from 'jsonwebtoken';
import { config } from '../config';

export const verifyToken = token => {
  console.log('running verify . . . ');
  jwt.verify(token, config.sessionSecret, (error, decoded) => {
    if (error) {
      console.log('Error: 😡 ', error);
      throw new AuthenticationError('you must be logged in');
    }
    console.log('decoded: 😎', decoded);
    return { user: decoded };
  });
};
