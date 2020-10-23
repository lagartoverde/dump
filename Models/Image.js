const mongoose = require('mongoose')
const imageSchema = new mongoose.Schema(
	{
		url: {
			type: String,
			required: true,
		},
		entityType: {
			type: String, // USER/SESSION
			required: true,
		},
		status: {
			type: Number,
		},
		galleryStatus: {
			type: Number,
		},
		createdBy: {
			type: mongoose.Schema.Types.ObjectId, // id of user model
		},
		author: {
			type: String,
			default: 'USER', // USER/ADMIN/SYSTEM/SCRIPT
		},
	},
	{ timestamps: true },
);

module.exports =  mongoose.model('Image', imageSchema);