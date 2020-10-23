const mongoose = require('mongoose')
const conversationSchema = new mongoose.Schema(
	{
		conversationName: String,
	},
	{
		timestamps: true,
	},
);

module.exports =  mongoose.model('Conversation', conversationSchema);