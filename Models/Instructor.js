const mongoose = require('mongoose')

const pastWorkSchema = new mongoose.Schema(
	{
		url: {
			type: String,
		},
	},
	{ _id: false },
);

const socialLinks = new mongoose.Schema(
	{
		twitter: {
			type: String,
		},
		instagram: {
			type: String,
		},
		facebook: {
			type: String,
		},
	},
	{ _id: false },
);

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

const instructorSchema = new mongoose.Schema(
	{
		fullName: {
			type: String,
		},
		about: {
			type: String,
		},
		designation: {
			type: String,
		},
		status: {
			type: Number,
		},
		yearsOfExperience: {
			type: Number,
		},
		profilePic: photoSchema,
		pastWork: [pastWorkSchema],
		socialLinks: socialLinks
	},
	{ timestamps: true },
);

module.exports = mongoose.model('Instructor', instructorSchema);