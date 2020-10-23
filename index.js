const mysql = require('mysql')
const mongoose = require('mongoose')
const cron = require('node-cron');
const CategoryModel = require('./Models/Category')
const SubcategoryModel = require('./Models/Subcategory')
const InstructorModel = require('./Models/Instructor')
const WhatsappGroupModel = require('./Models/WhatsappGroup')
const WhatsappGroupParticipantModel = require('./Models/WhatsappGroupParticipant')
const WaGroupAnalyticsModel = require('./Models/WaGroupAnalytics')
const UserModel = require('./Models/User')
const ProfileModel = require('./Models/Profile')
const ImageModel = require('./Models/Image')
const ConversationModel = require('./Models/Conversation')
const MessageModel = require('./Models/Message')
const VideoModel = require('./Models/Video')
const BadgeModel = require('./Models/Badge')
const CourseModel = require('./Models/Course')
const SessionModel = require('./Models/Session')
const SessionFeedbackModel = require('./Models/SessionFeedback')
const SessionParticipantModel = require('./Models/SessionParticipant')

require('dotenv').config()

const connection = mysql.createConnection({
  host     : process.env.MYSQL_HOST,
  user     : process.env.MYSQL_USER,
  password : process.env.MYSQL_PASSWORD,
});

async function startDump() {
  console.log('starting the dump')
  await dumpCategory();
  await dumpSubCategory();
  await dumpInstructor();
  await dumpWhatsappGroup()
  await dumpWhatsappGroupParticipant()
  await dumpWaGroupAnalytics()
  await dumpUsers()
  await dumpProfiles()
  await dumpImages()
  await dumpConversation()
  await dumpMessages()
  await dumpVideos()
  await dumpBadges()
  await dumpCourses()
  await dumpSessions()
  await dumpSessionFeedback()
  await dumpSessionParticipant()
  console.log('DUMP COMPLETED')
}

function query(queryString) {
  return new Promise((res, rej) => {
    connection.query(queryString, (err, results, fields) => {
      if(err) return rej(err)
      return res(results)
    })
  })
}

async function dumpCategory() {
  const tableExists = (await query("SHOW TABLES LIKE 'category'"))[0]
  if(!tableExists) {
    const queryString = `
      CREATE TABLE category (id VARCHAR(30) PRIMARY KEY, title TEXT, status INT)
    `
    await query(queryString)
  }
  const categories = await CategoryModel.find({})
  const insertQueryString = `
    INSERT INTO category (id, title, status)
    VALUES
    ${categories.map((category) => `('${category._id}', '${category.title}', ${category.status})`).join(', ')};
  `
  await query(insertQueryString)

  console.log('FINISHED categories')
}

async function dumpSubCategory() {
  const tableExists = (await query("SHOW TABLES LIKE 'subcategory'"))[0]
  if(!tableExists) {
    const queryString = `
      CREATE TABLE subcategory (id VARCHAR(30) PRIMARY KEY, title TEXT, status INT, category_id VARCHAR(30), FOREIGN KEY (category_id) REFERENCES category(id))
    `
    await query(queryString)
  }
  const subcategories = await SubcategoryModel.find({})
  const insertQueryString = `
    INSERT INTO subcategory (id, title, status, category_id)
    VALUES
    ${subcategories.map((subcategory) => `('${subcategory._id}', '${subcategory.title}', ${subcategory.status}, '${subcategory.categoryId}')`).join(', ')};
  `
  await query(insertQueryString)
  console.log('FINISHED subcategories')
}

async function dumpCourses() {
  const tableExists = (await query("SHOW TABLES LIKE 'courses'"))[0]
  if(!tableExists) {
    const queryString = `
      CREATE TABLE courses (id VARCHAR(30) PRIMARY KEY, title TEXT, subtitle TEXT, difficulty TEXT, subcategory_id VARCHAR(30), about TEXT, 
      sessions_count INT, instructor_id VARCHAR(30), available_slots INT, course_start_date DATETIME, course_end_date DATETIME,
      course_start_time TEXT, course_end_time TEXT, status INT, duration INT, FOREIGN KEY (subcategory_id) REFERENCES subcategory(id), FOREIGN KEY (instructor_id) REFERENCES subcategory(id) )
    `
    await query(queryString)
  }
  const insertQueryString = `
    INSERT INTO subcategory (id, title, status, category_id)
    VALUES
    ${subcategories.map((subcategory) => `('${subcategory._id}', '${subcategory.title}', ${subcategory.status}, ${subcategory.categoryId})`).join(', ')};
  `
  await query(insertQueryString)
  console.log('FINISHED courses')
}

async function dumpInstructor() {
  const photoTableExists = (await query("SHOW TABLES LIKE 'photo'"))[0]
  if(!photoTableExists) {
    const queryString = `
      CREATE TABLE photo (id VARCHAR(30) PRIMARY KEY, url TEXT, caption TEXT)
    `
    await query(queryString)
  }

  const socialLinksTableExists = (await query("SHOW TABLES LIKE 'social_links'"))[0]
  if(!socialLinksTableExists) {
    const queryString = `
      CREATE TABLE social_links (id VARCHAR(30) PRIMARY KEY, twitter TEXT, instagram TEXT, facebook TEXT)
    `
    await query(queryString)
  }


  const tableExists = (await query("SHOW TABLES LIKE 'instructor'"))[0]
  if(!tableExists) {
    const queryString = `
      CREATE TABLE instructor (id VARCHAR(30) PRIMARY KEY, full_name TEXT, about TEXT, designation TEXT,
      status INT, years_of_experience INT, profile_pic VARCHAR(30), social_links VARCHAR(30), 
      FOREIGN KEY (profile_pic) REFERENCES photo(id), FOREIGN KEY (social_links) REFERENCES social_links(id))
    `
    await query(queryString)
  }

  const pastWorkTableExists = (await query("SHOW TABLES LIKE 'past_work'"))[0]
  if(!pastWorkTableExists) {
    const queryString = `
      CREATE TABLE past_work (id VARCHAR(30) PRIMARY KEY, url TEXT, instructor_id VARCHAR(30), FOREIGN KEY (instructor_id) REFERENCES instructor(id))
    `
    await query(queryString)
  }

  const instructors = await InstructorModel.find({})

  for(let instructor of instructors) {
    await dumpPhotos([instructor.profilePic])
    await dumpSocialLinks(instructor.socialLinks)
  }

  const insertQueryString = `
    INSERT INTO instructor (id, full_name, about, designation, status, years_of_experience, profile_pic, social_links)
    VALUES
    ${instructors.map((instructor) => `('${instructor._id}', '${instructor.fullName}', '${escape(instructor.about)}', '${instructor.designation}',
      ${instructor.status ? instructor.status : 0}, ${instructor.yearsOfExperience ? instructor.yearsOfExperience : 0}, '${instructor.profilePic ? (instructor.profilePic._id ? instructor.profilePic._id : instructor.profilePic.url)  : ''}', ${instructor.socialLinks ? instructor.socialLinks._id + '' : null})`).join(', ')};
  `
  await query(insertQueryString)

  for(let instructor of instructors) {
    await dumpPastWork(instructor.pastWork, instructor._id)
  }
  console.log('FINISHED instructors')
}

async function dumpPastWork(pastwork, instructorId) {
  if(!pastwork.length) return;
  const insertQueryString = `
      INSERT INTO past_work (id, url, instructor_id)
      VALUES
      ${pastwork.map((pastwork) => `('${pastwork._id}', '${pastwork.url}', '${instructorId}')`).join(', ')};
    `
    await query(insertQueryString)
}

async function dumpPhotos(photos) {
  try {
    const insertQueryString = `
      INSERT INTO photo (id, url, caption)
      VALUES
      ${photos.map((photo) => `('${photo._id ? photo._id : photo.url}', '${photo.url}', '${photo.caption}')`).join(', ')};
    `
    await query(insertQueryString)
  } catch(e) {
  }
}

async function dumpSocialLinks(socialLinks) {
  if(!socialLinks) return;
  const insertQueryString = `
    INSERT INTO social_links (id, twitter, instagram, facebook)
    VALUES
    ('${socialLinks._id}', '${socialLinks.twitter}', '${socialLinks.instagram}', '${socialLinks.facebook}');
  `
  await query(insertQueryString)
}

async function dumpWhatsappGroup() {
  const tableExists = (await query("SHOW TABLES LIKE 'whatsapp_group'"))[0]
  if(!tableExists) {
    const queryString = `
      CREATE TABLE whatsapp_group (id VARCHAR(30) PRIMARY KEY, link TEXT, count_value INT, max_count INT,
      order_value INT, name TEXT, country TEXT, is_ref_group BOOLEAN, is_active BOOLEAN, source TEXT)
    `
    await query(queryString)
  }

  const whatsappGroups = await WhatsappGroupModel.find({})

  const insertQueryString = `
    INSERT INTO whatsapp_group (id, link, count_value, max_count, order_value, name, country, is_ref_group, is_active, source)
    VALUES
    ${whatsappGroups.map((whatsappGroup) => `('${whatsappGroup._id}', '${whatsappGroup.link}', ${whatsappGroup.count ? whatsappGroup.count : 0}, ${whatsappGroup.maxCount ? whatsappGroup.maxCount : 0},
      ${whatsappGroup.order ? whatsappGroup.order : 0}, '${whatsappGroup.name}', '${whatsappGroup.country}', ${whatsappGroup.isRefGroup}, ${whatsappGroup.isActive}, '${whatsappGroup.source}')`).join(', ')};
  `
  await query(insertQueryString)

  console.log('FINISHED whatsappgroup')
}

async function dumpWhatsappGroupParticipant() {
  const tableExists = (await query("SHOW TABLES LIKE 'whatsapp_group_participant'"))[0]
  if(!tableExists) {
    const queryString = `
      CREATE TABLE whatsapp_group_participant (id VARCHAR(30) PRIMARY KEY, phone TEXT, is_active BOOLEAN, join_date DATETIME,
      exit_date DATETIME, group_id VARCHAR(30), FOREIGN KEY (group_id) REFERENCES whatsapp_group(id))
    `
    await query(queryString)
  }

  const whatsappGroupParticipants = await WhatsappGroupParticipantModel.find({})
  if(!whatsappGroupParticipants.length) return;
  const insertQueryString = `
    INSERT INTO whatsapp_group_participant (id, phone, is_active, join_date, exit_date, group_id)
    VALUES
    ${whatsappGroupParticipants.map((whatsappGroupParticipant) => `('${whatsappGroupParticipant._id}', '${whatsappGroupParticipant.phone}', '${whatsappGroupParticipant.joinDate}',
      '${whatsappGroupParticipant.exitDate}', '${whatsappGroupParticipant.groupId}')`).join(', ')};
  `
  await query(insertQueryString)

  console.log('FINISHED whatsappgroupParticipant')
}

async function dumpWaGroupAnalytics() {
  const tableExists = (await query("SHOW TABLES LIKE 'wa_group_analytics'"))[0]
  if(!tableExists) {
    const queryString = `
      CREATE TABLE wa_group_analytics (id VARCHAR(30) PRIMARY KEY, group_id VARCHAR(30), FOREIGN KEY (group_id) REFERENCES whatsapp_group(id))
    `
    await query(queryString)
  }

  const waGroupAnalytics = await WaGroupAnalyticsModel.find({})
  const insertQueryString = `
    INSERT INTO whatsapp_group_participant (id,  group_id)
    VALUES
    ${waGroupAnalytics.map((waGroupAnalytics) => `('${waGroupAnalytics._id}', '${waGroupAnalytics.groupId}')`).join(', ')};
  `
  await query(insertQueryString)

  console.log('FINISHED waGroupAnalytics')
}

async function dumpUsers() {
  const tableExists = (await query("SHOW TABLES LIKE 'users'"))[0]
  if(!tableExists) {
    const queryString = `
      CREATE TABLE users (id VARCHAR(30) PRIMARY KEY, mobile TEXT, full_name TEXT, gender TEXT, profile_pic VARCHAR(30),
      email_verified INT, password TEXT, age INT, role TEXT, status INT, onboarding_status INT, author TEXT,
      FOREIGN KEY (profile_pic) REFERENCES photo(id))
    `
    await query(queryString)
  }

  const userPhotosTableExists = (await query("SHOW TABLES LIKE 'user_photos'"))[0]
  if(!userPhotosTableExists) {
    const queryString = `
      CREATE TABLE user_photos (id INT PRIMARY KEY AUTO_INCREMENT, photo_id VARCHAR(30), user_id VARCHAR(30),
      FOREIGN KEY (photo_id) REFERENCES photo(id), FOREIGN KEY (user_id) REFERENCES users(id))
    `
    await query(queryString)
  }

  const users = await UserModel.find({})


  const insertQueryString = `
      INSERT INTO users (id, mobile, full_name, gender, email_verified, password, age, role, status, onboarding_status, author)
      VALUES
      ${users.map((user) => `('${user._id}', '${user.mobile}','${user.fullName}', '${user.gender}',
        ${user.emailVerified ? user.emailVerified : 0},'${user.password}',${user.age ? user.age : 0}, '${user.role}', ${user.status ? user.status : 0}, ${user.onboardingStatus ? user.onboardingStatus : 0}, '${user.author}')`).join(', ')};
    `
  await query(insertQueryString)
  for(let user of users) {
    if(!user.photos.length) continue;
    await dumpPhotos(user.photos)
    const insertQueryString = `
      INSERT INTO user_photos (photo_id, user_id)
      VALUES
      ${user.photos.map((photo) => `('${photo._id ? photo._id : photo.url}', '${user._id}')`).join(', ')};
    `
    await query(insertQueryString)
  }
  console.log('FINISHED users')

}

async function dumpProfiles() {
  const tableExists = (await query("SHOW TABLES LIKE 'profile'"))[0]
  if(!tableExists) {
    const queryString = `
      CREATE TABLE profile (id VARCHAR(30) PRIMARY KEY, full_name TEXT, age INT, gender TEXT, profile_pic VARCHAR(30), parent_id VARCHAR(30),
      created_by VARCHAR(30))
    `
    await query(queryString)
  }

  const profiles = await ProfileModel.find({})
  const insertQueryString = `
    INSERT INTO profile (id, gender, age, profile_pic, parent_id)
    VALUES
    ${profiles.map((profile) => `('${profile._id}', '${profile.gender}', ${profile.age}, '${profile.profilePic}', '${profile.parentId}')`).join(', ')};
  `
  await query(insertQueryString)
  

  console.log('FINSHED profiles')

}

async function dumpImages() {

  const tableExists = (await query("SHOW TABLES LIKE 'image'"))[0]
  if(!tableExists) {
    const queryString = `
      CREATE TABLE image (id VARCHAR(30) PRIMARY KEY, url TEXT, entity_type TEXT, status INT, gallery_status INT,
      created_by VARCHAR(30), author TEXT)
    `
    await query(queryString)
  }
  const images = await ImageModel.find({})

  const insertQueryString = `
      INSERT INTO image (id, url, entity_type, status, gallery_status, created_by, author)
      VALUES
      ${images.map((image) => `('${image._id}', '${image.url}','${image.entity_type}', ${image.status ? image.status : 0}, 
      ${image.galleryStatus ? image.galleryStatus : 0},'${image.createdBy}','${image.author}')`).join(', ')};
    `
  await query(insertQueryString)

  console.log('FINSHED images')
}

async function dumpConversation() {
  const tableExists = (await query("SHOW TABLES LIKE 'conversation'"))[0]
  if(!tableExists) {
    const queryString = `
      CREATE TABLE conversation (id VARCHAR(30) PRIMARY KEY, conversation_name TEXT)
    `
    await query(queryString)
  }
  const conversations = await ConversationModel.find({})

  const insertQueryString = `
      INSERT INTO conversation (id, conversation_name)
      VALUES
      ${conversations.map((conversation) => `('${conversation._id}', '${escape(conversation.conversationName)}')`).join(', ')};
    `
  await query(insertQueryString)

  console.log('FINSHED conversation')
}

async function dumpMessages() {
  const tableExists = (await query("SHOW TABLES LIKE 'message'"))[0]
  if(!tableExists) {
    const queryString = `
      CREATE TABLE message (id VARCHAR(30) PRIMARY KEY, msg TEXT, msg_type TEXT, conversation_id VARCHAR(30), status INT,
      replied_to VARCHAR(30), picked_by VARCHAR(30), FOREIGN KEY (conversation_id) REFERENCES conversation(id))
    `
    await query(queryString)
  }

  const messages = await MessageModel.find({})

  const insertQueryString = `
      INSERT INTO message (id, msg, msg_type, conversation_id, status, replied_to, picked_by)
      VALUES
      ${messages.map((message) => `('${message._id}', '${escape(message.msg)}', '${message.msgType}', '${message.conversationId}', '${message.status}',
      '${message.repliedTo}','${message.pickedBy}')`).join(', ')};
    `
  await query(insertQueryString)

  console.log('FINISHED messages')
}

async function dumpVideos() {
  const tableExists = (await query("SHOW TABLES LIKE 'video'"))[0]
  if(!tableExists) {
    const queryString = `
      CREATE TABLE video (id VARCHAR(30) PRIMARY KEY, provider TEXT, video_id TEXT, video_name TEXT, video_desc TEXT,
      entity_type TEXT, entity_id TEXT, admin_uploaded BOOLEAN, status INT, author TEXT)
    `
    await query(queryString)
  }

  const videos = await VideoModel.find({})

  const insertQueryString = `
      INSERT INTO video (id, provider, video_id, video_name, video_desc, entity_type, entity_id, admin_uploaded, status, author)
      VALUES
      ${videos.map((video) => `('${video._id}', '${video.provider}', '${video.videoId}', '${video.videoName}',
      '${video.videoDesc}', '${video.entityType}','${video.entityId}','${video.adminUploaded}', ${video.status},'${video.author}')`).join(', ')};
    `
  await query(insertQueryString)

  console.log('FINISHED videos')
}

async function dumpBadges() {
  const tableExists = (await query("SHOW TABLES LIKE 'badge'"))[0]
  if(!tableExists) {
    const queryString = `
      CREATE TABLE badge (id VARCHAR(30) PRIMARY KEY, name TEXT, image VARCHAR(30), author TEXT, type TEXT)
    `
    await query(queryString)
  }

  const badges = await BadgeModel.find({})

  for(let badge of badges) {
    await dumpPhotos([badge.image])
  }

  const insertQueryString = `
      INSERT INTO badge (id, name, image, author, type)
      VALUES
      ${badges.map((badge) => `('${badge._id}', '${badge.name}', '${badge.image ? (badge.image._id ? badge.image._id : '') : ''}', '${badge.author}','${badge.type}')`).join(', ')};
    `
  await query(insertQueryString)

  console.log('FINISHED badges')
}

async function dumpCourses() {
  const tableExists = (await query("SHOW TABLES LIKE 'course'"))[0]
  if(!tableExists) {
    const queryString = `
      CREATE TABLE course (id VARCHAR(30) PRIMARY KEY, title TEXT, subtitle TEXT, age_range VARCHAR(30), difficulty TEXT, 
      subcategory VARCHAR(30), about TEXT, sessions_count INT, week_days VARCHAR(30), instructor_id VARCHAR(30), available_slots INT,
      course_start_date DATETIME, course_end_date DATETIME, course_start_time TEXT, course_end_time TEXT, status INT, duration INT,
      cover_picture VARCHAR(30))
    `
    await query(queryString)
  }

  const ageRangeTableExists = (await query("SHOW TABLES LIKE 'age_range'"))[0]
  if(!ageRangeTableExists) {
    const queryString = `
      CREATE TABLE age_range (id INT PRIMARY KEY AUTO_INCREMENT, min INT, max INT, course VARCHAR(30), FOREIGN KEY (course) REFERENCES course(id))
    `
    await query(queryString)
  }

  const weekdaysTableExists = (await query("SHOW TABLES LIKE 'week_days'"))[0]
  if(!weekdaysTableExists) {
    const queryString = `
      CREATE TABLE week_days (id INT PRIMARY KEY AUTO_INCREMENT, sunday BOOLEAN, monday BOOLEAN, tuesday BOOLEAN, wednesday BOOLEAN,
      thursday BOOLEAN, friday BOOLEAN, saturday BOOLEAN, course VARCHAR(30), FOREIGN KEY (course) REFERENCES course(id))
    `
    await query(queryString)
  }

  

  const courses = await CourseModel.find({})

  for(let course of courses) {
    if(course.coverPicture) {
      await dumpPhotos([course.coverPicture])
    }
  }

  const insertQueryString = `
      INSERT INTO course (id, title, subtitle, difficulty, subcategory, about, sessions_count, instructor_id,
        available_slots, course_start_date, course_end_date, course_start_time, course_end_time, status, duration, cover_picture)
      VALUES
      ${courses.map((course) => `('${course._id}', '${course.title}', '${course.subtitle}',
      '${course.difficulty}', '${course.subcategory}', '${course.about}', ${course.sessionsCount ? course.sessionsCount : 0},
      '${course.instructorId}', ${course.availableSlots ? course.availableSlots : 0}, '${course.courseStartDate}', '${course.courseEndDate}',
      '${course.courseStartTime}', '${course.courseEndTime}', ${course.status ? course.status : ''}, ${course.duration ? course.duration : 0},'${course.coverPicture ? (course.coverPicture._id ? course.coverPicture._id : course.coverPicture.url) : ''}')`).join(', ')};
    `

  await query(insertQueryString)

  for(let course of courses) {
    await dumpAgeRange(course.ageRange, course._id)
    await dumpWeekdays(course.weekdays, course._id)
  }

  console.log('FINSHED courses')
}

async function dumpAgeRange(ageRange, courseId) {
  if(!ageRange) return;
  const queryString = `
    INSERT INTO age_range (min, max, course)
      VALUES
      (${ageRange.min}, ${ageRange.max},  '${courseId}')
  `
  await query(queryString)
}

async function dumpWeekdays(weekdays, courseId) {
  if(!weekdays) return;
  const queryString = `
    INSERT INTO week_days (sunday, monday, tuesday, wednesday, thursday, friday, saturday, course)
      VALUES
      (${weekdays.sunday}, ${weekdays.monday}, ${weekdays.tuesday}, ${weekdays.wednesday},
      ${weekdays.thursday},${weekdays.friday},${weekdays.saturday}, '${courseId}')
  `
  await query(queryString)
}

async function dumpPolls() {
  const tableExists = (await query("SHOW TABLES LIKE 'poll'"))[0]
  if(!tableExists) {
    const queryString = `
      CREATE TABLE course (id VARCHAR(30) PRIMARY KEY, question TEXT, answer VARCHAR(30), session_id VARCHAR(30), trigger_time INT, 
      duration INT, wait_duration INT, show_result_duration INT, question_type TEXT, answer_type TEXT, badge_id VARCHAR(30),
      FOREIGN_KEY (session_id) )
    `
    await query(queryString)
  }
}

async function dumpSessions() {
  const tableExists = (await query("SHOW TABLES LIKE 'session'"))[0]
  if(!tableExists) {
    const queryString = `
      CREATE TABLE session (id VARCHAR(30) PRIMARY KEY, session_num TEXT, coach_password TEXT, topic TEXT, course_id VARCHAR(30), 
      cover_picture VARCHAR(30), cover_color TEXT, total_slots INT, available_slots INT, status INT, session_type INT, provider TEXT,
      datetime DATETIME, duration INT, conversation_id VARCHAR(30), meeting_type TEXT, is_trial_session BOOLEAN, video VARCHAR(30),
      description TEXT)
    `
    await query(queryString)
  }

  const sessions = await SessionModel.find({})

  for(let session of sessions) {
    if(session.coverPicture) {  
      dumpPhotos([session.coverPicture])
    }
  }

  const queryString = `
    INSERT INTO session (id, session_num, coach_password, topic, course_id, cover_picture, cover_color, total_slots, available_slots,
    status, session_type, provider, datetime, duration, conversation_id, meeting_type, is_trial_session, video, description)
      VALUES
      ${sessions.map((session) => `('${session._id}', '${session.sessionNum}', '${session.coachPassword}', '${escape(session.topic)}',
      '${session.course_id}','${session.coverPicture ? (session.coverPicture._id ? session.coverPicture._id : session.coverPicture.url) : ''}',
      '${session.coverColor}',${session.totalSlots ? session.totalSlots : 0},${session.availableSlots ? session.availableSlots : 0},${session.status ? session.status : 0},${session.sessionType ? session.sessionType : 0},
      '${session.provider}','${session.datetime}',${session.duration ? session.duration : 0},'${session.conversation_id}','${session.meetingType}',
      '${session.isTrialSession}','${session.video}','${escape(session.description)}')`).join(', ')};
  `
  await query(queryString)

  console.log('FINISHED sessions')
}

async function dumpSessionFeedback() {
  const tableExists = (await query("SHOW TABLES LIKE 'session_feedback'"))[0]
  if(!tableExists) {
    const queryString = `
      CREATE TABLE session_feedback (id VARCHAR(30) PRIMARY KEY, profile_id VARCHAR(30), session_id VARCHAR(30), 
      FOREIGN KEY (profile_id) REFERENCES profile(id), FOREIGN KEY (session_id) REFERENCES session(id))
    `
    await query(queryString)
  }

  const sessionFeedbacks = await SessionFeedbackModel.find({})

  const queryString = `
    INSERT INTO session_feedback (id, profile_id, session_id)
      VALUES
      ${sessionFeedbacks.map((sessionFeedback) => `('${sessionFeedback._id}', '${sessionFeedback.profileId}', '${sessionFeedback.sessionId}')`).join(', ')};
  `
  await query(queryString)
  
  console.log('FINISHED session feedback')
}

async function dumpSessionParticipant() {
  const tableExists = (await query("SHOW TABLES LIKE 'session_participant'"))[0]
  if(!tableExists) {
    const queryString = `
      CREATE TABLE session_participant (id VARCHAR(30) PRIMARY KEY, joined_from TEXT, status INT, type TEXT)
    `
    await query(queryString)
  }

  const watchTimeTableExists = (await query("SHOW TABLES LIKE 'watch_time'"))[0]
  if(!watchTimeTableExists) {
    const queryString = `
      CREATE TABLE watch_time (id VARCHAR(30) PRIMARY KEY, started_watching INT, stopped_watching INT, minutes_watched INT, participant VARCHAR(30),
      FOREIGN KEY (participant) REFERENCES session_participant(id))
    `
    await query(queryString)
  }

  const watchTimeMinutesTable = (await query("SHOW TABLES LIKE 'watch_time_minutes'"))[0]
  if(!watchTimeMinutesTable) {
    const queryString = `
      CREATE TABLE watch_time_minutes (id INT PRIMARY KEY AUTO_INCREMENT, minute INT, watch_time VARCHAR(30), FOREIGN KEY (watch_time) REFERENCES watch_time(id))
    `
    await query(queryString)
  }

  const watchTimeRefreshedTableExists = (await query("SHOW TABLES LIKE 'watch_time_refreshed'"))[0]
  if(!watchTimeRefreshedTableExists) {
    const queryString = `
      CREATE TABLE watch_time_refreshed (id INT PRIMARY KEY AUTO_INCREMENT, refreshed BOOLEAN, watch_time VARCHAR(30), FOREIGN KEY (watch_time) REFERENCES watch_time(id))
    `
    await query(queryString)
  }

  const sessionParticipants = await SessionParticipantModel.find({})

  const queryString = `
  INSERT INTO session_participant (id, joined_from, status, type)
    VALUES
    ${sessionParticipants.map((participant) => `('${participant._id}', '${participant.joinedFrom}',${participant.status ? participant.status : 0}, '${participant.type}')`).join(', ')};
  `
  await query(queryString)

  for(let participant of sessionParticipants) {
    if(participant.watchTime) {
      await dumpWatchTime(participant.watchTime, participant._id)
    }
  }

  console.log('FINISHED session participants')

 
}

async function dumpWatchTime(watchTime, participantId) {
  const random = Math.random(0, Math.pow(10, 29))
  const watchTimeId = random + ''
  const queryString = `
    INSERT INTO watch_time (id, started_watching, stopped_watching, minutes_watched, participant)
      VALUES
      ('${watchTimeId}', ${watchTime.startedWatching ? watchTime.startedWatching : 0}, ${watchTime.stoppedWatching ? watchTime.stoppedWatching : 0}, 
      ${watchTime.minutesWatched ? watchTime.minutesWatched : 0},'${participantId}')
  `
  await query(queryString)
  if(watchTime.minutes.length) {
    await dumpWatchTimeMinutes(watchTime.minutes, watchTimeId);
  }
  if(watchTime.refreshedAt.length) {
    await dumpWatchTimeRefreshed(watchTime.refreshedAt, watchTimeId)
  }
}

async function dumpWatchTimeMinutes(minutes, watchTime) {
  const queryString = `
    INSERT INTO watch_time_minutes ( minute, watch_time)
        VALUES
        ${minutes.map((minute) => `(${minute}, '${watchTime}')`).join(', ')};
    `
}

async function dumpWatchTimeRefreshed(refreshed, watchTime) {
  const queryString = `
    INSERT INTO watch_time_refreshed ( refreshed, watch_time)
        VALUES
        ${refreshed.map((refreshed) => `(${refreshed}, '${watchTime}')`).join(', ')};
    `
}

async function clearDatase() {
  console.log('clearing database')
  await query('DROP DATABASE dump;')
  await query('CREATE DATABASE dump;')
  await query('USE dump;')
}

async function start() {
  await connection.connect();
  await mongoose.connect(process.env.MONGO_DB, {useNewUrlParser: true, useUnifiedTopology: true});
  console.log('connected')
  await clearDatase()
  await startDump()
}

//Run on saturday at 00:00
console.log('cron set, dump will start on saturday at 00:00')
cron.schedule('0 0 * * 6', () => {
  start()
});


module.exports = start