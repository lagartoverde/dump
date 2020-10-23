const mongoose = require('mongoose')
const photoSchema = new mongoose.Schema(
	{
		id: {
			type: mongoose.Schema.Types.ObjectId,
		},
		url: {
			type: String,
		},
		caption: {
			type: String,
		},
	},
	{ _id: false },
);
const sessionSchema = new mongoose.Schema(
	{
		sessionNum: {
			type: String,
		},
		coachPassword: {
			type: String,
		},
		topic: String,
		courseId: mongoose.Schema.Types.ObjectId, // id of the course model
		coverPicture: photoSchema, // photoSchema contains the id if the image model
		coverColor: String,
		totalSlots: Number,
		availableSlots: Number,
		status: {
			type: Number,
		},
		sessionType: {
			type: Number,
		},
		provider: {
			type: String,
		},
		dateTime: Date,
		duration: Number,
		// Conversation ID for Chat
		conversationId: mongoose.Schema.Types.ObjectId, // id of conversation model
		meetingType: {
			type: String,
		},
		isTrialSession: {
			type: Boolean,
		},
		video: mongoose.Schema.Types.ObjectId, // id of video model
		description: String,
	},
	{ timestamps: true },
);

module.exports =  mongoose.model('Session', sessionSchema);