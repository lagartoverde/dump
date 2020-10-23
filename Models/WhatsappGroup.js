const mongoose = require('mongoose')
const whatsappGroupSchema = new mongoose.Schema(
	{
		link: {
			type: String,
			required: true,
			unique: true,
		},
		count: {
			type: Number,
			default: 0,
		},
		maxCount: {
			type: Number,
			default: 400,
		},
		order: Number,
		name: {
			type: String,
			required: true,
		},
		country: String,
		isRefGroup: {
			type: Boolean,
			default: false,
		},
		isActive: Boolean,
		source: String,
	},
	{ timestamps: true },
);

module.exports = mongoose.model('WhatsappGroup', whatsappGroupSchema);