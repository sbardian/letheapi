import mongoose from 'mongoose';

// Create a schema
const ItemSchema = new mongoose.Schema({
  title: String,
});

module.exports = mongoose.model('Item', ItemSchema);
