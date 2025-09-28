import mongoose, { model, models } from 'mongoose';

const CertificateSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    domain: {
        type: String,
        required: true
    },
    orderUrl: {
        type: String
    },
    privateKeyPem: {
        type: String,
        required: true
    },
    csrPem: {
        type: String,
        required: true
    },
    certPem: {
        type: String
    },
    fullChainPem: {
        type: String
    },
    expiryDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['pending', 'issued', 'expired', 'failed'],
        default: 'pending'
    },
}, {
    timestamps: true
});

const Certificate = models.Certificate || model("Certificate", CertificateSchema);
export default Certificate;