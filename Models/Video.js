const mongoose = require('mongoose')
const videoSchema = new mongoose.Schema(
	{
		provider: {
			type: String,
		},
		videoId: String,
		videoName: String,
		videoDesc: String,
		entityType: {
			type: String, // USER/COURSE/SESSION
		},
		entityId: {
			type: String,  // id of session model or course model
		},
		adminUploaded: {
			type: Boolean,
		},
		status: {
			type: Number,
		},
		author: {
			type: String,
			default: 'USER', // USER/ADMIN/SYSTEM/SCRIPT
		},
	},
	{ timestamps: true },
);

module.exports =  mongoose.model('Video', videoSchema);