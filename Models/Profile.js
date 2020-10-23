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
const profileSchema = new mongoose.Schema(
	{
		fullName: {
			type: String,
		},
		age: {
			type: Number,
		},
		gender: {
			type: String,
		},
		profilePic: {
			type: photoSchema,
		},
		parentId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User', // 3
		},
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User', // 3
		},
	},
	{ timestamps: true },
);

module.exports =  mongoose.model('Profile', profileSchema);