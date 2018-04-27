import mongoose from 'mongoose';

const GroupSchema = new mongoose.Schema({
  title: String,
  owner: String,
  users: Array,
  items: Array,
});

const Group = mongoose.model('Group', GroupSchema);
export default Group;