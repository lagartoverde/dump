const mongoose = require('mongoose')
const watchTimeSchema = new mongoose.Schema(
	{
		minutes: [Boolean],
		startedWatching: Number,
		stoppedWatching: Number,
		minutesWatched: Number,
		refreshedAt: [Number],
	},
	{ timestamps: false, _id: false },
);

const sessionParticipantSchema = new mongoose.Schema(
	{
		sessionId: mongoose.Schema.Types.ObjectId, // id of session model
		joinedFrom: {
			type: String,
		},
		status: {
			type: Number,
		},
		type: {
			type: String,
		},
		watchTime: watchTimeSchema,
	},
	{ timestamps: true },
);

module.exports =  mongoose.model('SessionParticipant', sessionParticipantSchema);