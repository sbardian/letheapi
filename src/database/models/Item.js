import mongoose from 'mongoose';

// Create a schema
const ItemSchema = new mongoose.Schema({
  title: String,
});

const Item = mongoose.model('Item', ItemSchema);
export default Item;
