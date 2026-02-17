const mongoose = require('mongoose');

const sharedCodeSchema = new mongoose.Schema({
    shareId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    code: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 } // This creates a TTL index that deletes the document when the current time reaches expiresAt
    }
});

module.exports = mongoose.model('SharedCode', sharedCodeSchema);
