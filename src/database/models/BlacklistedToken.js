import mongoose from 'mongoose';

const BlacklistedTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    require: true,
    trim: true,
  },
});

const BlacklistedToken = mongoose.model(
  'BlacklistedToken',
  BlacklistedTokenSchema,
);
export default BlacklistedToken;
