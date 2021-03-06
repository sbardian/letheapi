import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  title: String,
  list: String,
  creator: String,
  status: Boolean,
});

const Item = mongoose.model('Item', ItemSchema);
export default Item;
