import mongoose from 'mongoose';

const InvitationSchema = new mongoose.Schema({
  inviter: String,
  invitee: String,
  title: String,
  list: String,
});

const Invitation = mongoose.model('Invitation', InvitationSchema);
export default Invitation;
