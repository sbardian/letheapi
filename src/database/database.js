import mongoose from 'mongoose';
import { Item, User } from './models';
import { shoppingItems, userItems } from './mocks';

export default () => {
  mongoose.promise = global.Promise;
  const db_url = 'mongodb://localhost/shoppinglist';
  mongoose.connect(db_url);
  const db = mongoose.connection;
  // Item.insertMany(shoppingItems);
  // User.insertMany(userItems);
  return db;
};
