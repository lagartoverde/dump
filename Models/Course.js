const mongoose = require('mongoose')

const minMaxSchema = new mongoose.Schema(
	{
		min: Number,
		max: Number,
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

const weekdaysSchema = new mongoose.Schema(
	{
		sunday: {
			type: Boolean,
		},
		monday: {
			type: Boolean,
		},
		tuesday: {
			type: Boolean,
		},
		wednesday: {
			type: Boolean,
		},
		thursday: {
			type: Boolean,
		},
		friday: {
			type: Boolean,
		},
		saturday: {
			type: Boolean,
		},
	},
	{ _id: false },
);

const courseSchema = new mongoose.Schema(
	{
		title: {
			type: String,
		},
		subtitle: {
			type: String,
		},
		ageRange: {
			type: minMaxSchema,
		},
		difficulty: {
			type: String,
		},
		subcategoryId: {
			type: mongoose.Schema.Types.ObjectId, // id of subcategory model
		},
		about: {
			type: String,
		},
		sessionsCount: {
			type: Number,
		},
		weekdays: weekdaysSchema,
		instructorId: {
			type: mongoose.Schema.Types.ObjectId, // id of mentor model
		},
		availableSlots: {
			type: Number,
		},
		courseStartDate: {
			type: Date,
		},
		courseEndDate: {
			type: Date,
		},
		courseStartTime: {
			type: String,
		},
		courseEndTime: {
			type: String,
		},
		status: {
			type: Number,
		},
		duration: {
			type: Number,
		},
		coverPicture: photoSchema,
	},
	{ timestamps: true },
);

module.exports =  mongoose.model('Course', courseSchema);