const mongoose = require('mongoose')
const optionSchema = new mongoose.Schema(
	{
		id: {
			type: Schema.Types.ObjectId,
		},
		option: {
			type: String,
		},
	},
	{ _id: false },
);

const pollSchema = new mongoose.Schema(
	{
		question: {
			type: String,
		},
		options: [optionSchema],
		answer: {
			type: mongoose.Schema.Types.ObjectId, // id of optionSchema
		},
		sessionId: {
			type: mongoose.Schema.Types.ObjectId, // id of session model
			ref: 'Session',
		},
		// Time at which the poll should appear
		triggerTime: {
			type: Number,
		},
		// Duration for which the poll should be shown
		duration: {
			type: Number,
		},
		// Duration for which a poll should wait before showing the results
		waitDuration: {
			type: Number,
		},
		// Duration for which the results should be shown
		showResultDuration: {
			type: Number,
		},
		questionType: {
			type: String,
		},
		answerType: {
			type: String,
		},
		badgeId: {
			type: mongoose.Schema.Types.ObjectId, // id of badge model
			ref: 'Badge',
		},
	},
	{ timestamps: true },
);

module.exports =  mongoose.model('Poll', pollSchema);