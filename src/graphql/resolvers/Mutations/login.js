import { authorizeLogin } from '../../businessLogic';

export const login = (
  root,
  { loginInput: { username, password } },
  { models: { User } },
) => authorizeLogin(username, password, User);
