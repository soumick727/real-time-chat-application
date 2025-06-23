const mongoose = require('mongoose');
const chatSchema = new mongoose.Schema({
    chatName: {
        type:String,
        trim: true,
    },
    isGroupChat: {
        type: Boolean,
        default: false,
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "message",
    },
    unreadMessageCount:{
        type: Number,
        default: 0
    },
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }

}, {timestamps: true} );

module.exports = mongoose.model('Chat', chatSchema);