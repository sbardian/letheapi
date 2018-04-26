import { authorizeSignup } from '../../businessLogic';

export const signup = (
  root,
  { signupInput: { username, email, password } },
  { models: { User } },
) => authorizeSignup(username, email, password, User);
