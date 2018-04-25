import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import shoppingItems from '../../database/mocks';
import { returnItems } from '../../database/utils';
import { JWT_SECRET } from '../../config/config';

const resolvers = {
  Query: {
    getItems: async (root, { limit = 500 }, { Item }) =>
      (await Item.find({}).limit(limit)).map(returnItems),
  },
  Mutation: {
    createNewItem: async (root, { titles }, { Item }) =>
      (await Item.create(titles)).map(returnItems),
    login: async (root, { user }, context) => {
      const { User } = context;
      const { email, password } = user;
      /*
      User.findOne({ email }).then(u =>
        bcrypt.compare(password, u.password).then(res => {
          console.log('g2g', res);
          if (res) {
            const token = jwt.sign(
              {
                id: u.id,
                email: u.email,
              },
              JWT_SECRET,
            );
            u.jwt = token;
            context.user = Promise.resolve(u);
            console.log('User = ', u);
            return u;
          }
        }),

      await User.findOne({ email })
        .then(u => {
          bcrypt.compare(password, u.password);
        })
        .then(res => {
          if (res) {
            console.log('res = ', res);
            const token = jwt.sign(
              {
                id: u.id,
                email: u.email,
              },
              JWT_SECRET,
            );
            u.jwt = token;
            context.user = Promise.resolve(u);
            console.log('User = ', u);
            return u;
          }
        });
        */

      let u = await User.findOne({ email });
      const res = await bcrypt.compare(password, u.password);
      if (res) {
        const token = jwt.sign(
          {
            id: u.id,
            email: u.email,
          },
          JWT_SECRET,
        );
        // u.jwt = token;
        // u = { ...u, jwt: token };
        context.user = Promise.resolve(u);
        console.log('User = ', u);
        return u;
      }
    },

    // login: async (root, { user }, context) => {
    //   const { User } = context;
    //   const { email, password } = user;
    //   console.log('email = ', email);
    //   console.log('password = ', password);
    //   User.findOne({ email }).then(user1 => {
    //     console.log('found user');
    //     return bcrypt.compare(password, user1.password).then(res => {
    //       console.log('found user and bcrypt g2g');
    //       if (res) {
    //         const token = jwt.sign(
    //           {
    //             id: user1.id,
    //             email: user1.email,
    //           },
    //           JWT_SECRET,
    //         );
    //         user1.jwt = token;
    //         context.user = Promise.resolve(user1);
    //         return user1;
    //       }
    //       return Promise.reject('Bad email or password 1');
    //     });
    //   });
    //   return Promise.reject('Bad email or password 2');
    // },

    signup: async (root, { email, password, username }, context) => {
      // find user by email
      return User.findOne({ email }).then(existing => {
        if (!existing) {
          // hash password and create user
          return bcrypt
            .hash(password, 10)
            .then(hash =>
              User.create({
                email,
                password: hash,
                username: username || email,
              }),
            )
            .then(user => {
              const { id } = user;
              const token = jwt.sign({ id, email }, JWT_SECRET);
              user.jwt = token;
              context.user = Promise.resolve(user);
              return user;
            });
        }
        return Promise.reject('email already exists');
      });
    },
  },
};

export default resolvers;
