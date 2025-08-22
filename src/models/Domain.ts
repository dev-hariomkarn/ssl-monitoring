import mongoose, { model, models } from 'mongoose';

const DomainSchema = new mongoose.Schema({
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  domain: { type: String, required: true, unique: true },
  issueDate: { type: Date, required: true },
  expiryDate: { type: Date, required: true },
  daysLeft: { type: Number, required: true },
  status: { type: String, enum: ['OK', 'Expiring soon', 'Expired'], required: true },
}, {
  timestamps: true
});

const Domain = models.Domain || model("Domain", DomainSchema)
export default Domain;