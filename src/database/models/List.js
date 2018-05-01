import mongoose from 'mongoose';

const ListSchema = new mongoose.Schema({
  title: String,
  owner: String,
  users: Array,
  items: Array,
});

const List = mongoose.model('List', ListSchema);
export default List;
