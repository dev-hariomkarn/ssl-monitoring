import mongoose, { model, models } from 'mongoose';

const AcmeAccountSchema = new mongoose.Schema({
    accountKey: {
        type: String,
        required: true
    },
    registered: {
        type: Boolean,
        default: false
    },
    accountUrl: {
        type: String
    },
}, {
    timestamps: true
});

const AcmeAccount = models.AcmeAccount || model("AcmeAccount", AcmeAccountSchema);
export default AcmeAccount;
