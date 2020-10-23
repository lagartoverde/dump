const mongoose = require('mongoose');
const waGroupAnalyticsSchema = new mongoose.Schema(
	{
		groupId: mongoose.Schema.Types.ObjectId, // id of whatsappgroup model
	},
	{ timestamps: true },
);

module.exports =  mongoose.model('WaGroupAnalytics', waGroupAnalyticsSchema);