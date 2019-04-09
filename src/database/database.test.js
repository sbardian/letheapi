import connectDB from './database';

describe('Database connect tests', () => {
  it('Successfully connects to the database', async () => {
    const mongoose = await connectDB();
    expect(mongoose.connection.readyState).toEqual(1);
    mongoose.connection.close();
  });
});
