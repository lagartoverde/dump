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
const badgeSchema = new mongoose.Schema(
	{
		name: String,
		image: photoSchema,
		author: {
			type: String,
		},
		type: {
			type: String,
		},
	},
	{ timestamps: true },
);

module.exports =  mongoose.model('Badge', badgeSchema);