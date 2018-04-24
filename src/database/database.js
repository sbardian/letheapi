import mongoose from 'mongoose';
import Item from './model';
import { shoppingItems } from './mocks';

export default () => {
  mongoose.promise = global.Promise;
  const db_url = 'mongodb://localhost/shoppinglist';
  mongoose.connect(db_url);
  const db = mongoose.connection;
  Item.insertMany(shoppingItems);
  return db;
};
