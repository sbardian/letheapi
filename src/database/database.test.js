import connectDB from './database';

describe('Database connect tests', () => {
  it('Successfully connects to the database', async () => {
    const mongod = await connectDB();
    expect(mongod.mongoose.connection.readyState).toEqual(1);
    mongod.mongoose.connection.close();
  });
});
