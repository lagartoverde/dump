const mongoose = require('mongoose')
const whatsappGroupParticipantSchema = new mongoose.Schema(
	{
		groupId: {
			type: mongoose.Schema.Types.ObjectId, // id of whatsappgroup model
		},
		phone: String,
		isActive: Boolean,
		joinDate: Date,
		exitDate: Date,
	},
	{ timestamps: true },
);

module.exports = mongoose.model('WhatsappGroupParticipant', whatsappGroupParticipantSchema);