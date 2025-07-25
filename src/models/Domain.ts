import mongoose from 'mongoose';

const DomainSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  domain: String,
  issueDate: String,
  expiryDate: String,
  daysLeft: Number,
  status: String,
});

export default mongoose.models.Domain || mongoose.model('Domain', DomainSchema);
