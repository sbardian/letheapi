import mongoose from 'mongoose';
import MongodbMemoryServer from 'mongodb-memory-server';
import { Item, User, List } from './models';
import { config } from '../config';
import { listItems, shoppingItems, userItems } from './mocks';
import { returnUsers, returnItems, returnLists } from './utils';

export default async () => {
  const { sessionSecret, mockMode, databaseUrl } = config;
  mongoose.promise = global.Promise;
  if (mockMode) {
    const MONGO_DB_NAME = 'mockMongoDB';
    const MONGO_DB_PORT = '9088';
    const mongod = new MongodbMemoryServer({
      instance: {
        port: MONGO_DB_PORT,
        dbName: MONGO_DB_NAME,
      },
    });
    const MONGO_MOCK_URI = await mongod.getConnectionString();
    console.log('connection string = ', MONGO_MOCK_URI);
    mongoose.connect(MONGO_MOCK_URI);
    const mockDB = mongoose.connection;

    // TODO: structure to make sense for dev.
    await User.insertMany(userItems);
    // const insertedUser = [(await User.find())[0]];
    // const user = insertedUser.map(returnUsers);
    // await List.create(
    //   listItems.map(({ title }) => ({
    //     title: title,
    //     owner: user[0].id,
    //     users: [{ user: user[0].id }],
    //     items: [],
    //   })),
    // );
    // const insertedList = [(await List.find())[0]];
    // console.log('insertedList = ', insertedList);
    // const temp = shoppingItems.map(item => ({
    //   ...item,
    //   creator: insertedUser[0].id,
    //   list: insertedList[0].id,
    // }));
    // console.log('temp = ', temp);
    // const insertedItem = await Item.insertMany(temp);
    // console.log('insertedItems = ', insertedItem);
  } else {
    mongoose.connect(databaseUrl);
  }
  const db = mongoose.connection;

  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', () => {
    return console.log('Connected to the database!');
  });
};
