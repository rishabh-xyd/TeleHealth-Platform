import mongoose from 'mongoose';

const ehrSchema = new mongoose.Schema({
    patientId: {
        type: String,
        required: true,
    },
    doctorId: {
        type: String,
        required: true,
    },
    diagnosis: {
        type: String,
        required: true,
    },
    prescription: [
        {
            medicine: String,
            dosage: String,
            duration: String,
        },
    ],
    notes: {
        type: String,
    },
    attachments: [
        {
            fileName: String,
            fileUrl: String, // In a real app, this would be AWS S3 URL
        },
    ],
}, {
    timestamps: true,
});

const EHR = mongoose.model('EHR', ehrSchema);

export default EHR;
