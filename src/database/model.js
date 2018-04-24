import mongoose from 'mongoose';

// Create a schema
const ItemSchema = new mongoose.Schema({
  itemId: Number,
  title: String,
});

module.exports = mongoose.model('Item', ItemSchema);
