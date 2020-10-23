const mongoose = require('mongoose')
const messageSchema = new mongoose.Schema(
	{
		msg: {
			type: String,
		},
		msgType: {
			type: String,
		},
		conversationId: {
			type: mongoose.Schema.Types.ObjectId,
			default: null,
			ref: 'Conversation', // 5
		},
		status: {
			type: Number,
		},
		repliedTo: {
			type: mongoose.Schema.Types.ObjectId, // contains the message id of the message being replied to [Let me know if you need more clarification on this.
		},
		pickedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User', // 3
		},
	},
	{
		timestamps: true,
	},
);

module.exports =  mongoose.model('Message', messageSchema);