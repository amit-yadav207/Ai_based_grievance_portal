
const mongoose = require('mongoose')


// Define the ChatHistory schema
const ChatHistorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    userResponse: {
        type: String,
        required: true
    },
    botResponse: {
        type: String,
        required: true
    }
});

module.exports =  mongoose.model('ChatHistory', ChatHistorySchema);