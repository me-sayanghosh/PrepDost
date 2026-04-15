const mongoose = require('mongoose');

const blacklistSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, 'Token is required to be added in the blacklist'],
    },
}, { timestamps: true })
const blacklistmodel = mongoose.model('Blacklist', blacklistSchema);

module.exports = blacklistmodel;