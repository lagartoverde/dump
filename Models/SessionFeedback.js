const mongoose = require('mongoose')
const sessionFeedbackSchema = new mongoose.Schema(
	{
		profileId: {
			type: mongoose.Schema.Types.ObjectId, // id of profile model
		},
		sessionId: {
			type: mongoose.Schema.Types.ObjectId, // id of session model
		},
		feedback: {
			type: String,
		},
	},
	{ timestamps: true },
);

module.exports =  mongoose.model('SessionFeedback', sessionFeedbackSchema);