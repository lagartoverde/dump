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

const userSchema = new mongoose.Schema(
	{
		mobile: {
			type: String,
			unique: true,
		},
		fullName: {
			type: String,
		},
		gender: {
			type: String,
		},
		profilePic: {
			type: photoSchema,
		},
		email: {
			type: [String],
		},
		emailVerified: {
			type: Number,
		},
		password: {
			type: String,
		},
		age: {
			type: Number,
		},
		photos: {
			type: [photoSchema],
		},
		role: {
			type: String,
		},
		status: {
			type: Number,
		},
		onboardingStatus: {
			type: Number,
		},
		author: {
			type: String,
		},
	},
	{ timestamps: true },
);

module.exports =  mongoose.model('User', userSchema);