import mongoose from 'mongoose';

const ListSchema = new mongoose.Schema({
  title: String,
  owner: {},
  users: Array,
  items: Array,
  listImageUrl: String,
});

const List = mongoose.model('List', ListSchema);
export default List;
