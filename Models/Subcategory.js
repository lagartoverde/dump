const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema(
	{
		title: {
			type: String,
		},
		subtitle: {
			type: String,
		},
		// ageRange: {
		// 	type: minMaxSchema,
		// },
		difficulty: {
			type: String,
			enum: ['EASY', 'MEDIUM', 'HARD'],
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
		// sessions: [sessionSchema],
		// weekdays: weekdaysSchema,
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
		// coverPicture: photoSchema,
		// photos: [photoSchema],
		// video: {
		// 	type: idSchema, // contains id of video model
		// },
		skillTags: [
			{
				type: String,
			},
		],
	},
	{ timestamps: true },
);

const subcategorySchema = new mongoose.Schema(
	{
		title: {
			type: String,
		},
		status: {
			type: Number,
		},
		categoryId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Category', // 1
		},
		courses: [courseSchema],
	},
	{ timestamps: true },
);


module.exports =  mongoose.model('Subcategory', subcategorySchema);