const mongoose = require('mongoose')
const categorySchema = new mongoose.Schema(
	{
		title: {
			type: String,
		},
		status: {
			type: Number,
		},
	},
	{ timestamps: true },
);

module.exports =  mongoose.model('Category', categorySchema);