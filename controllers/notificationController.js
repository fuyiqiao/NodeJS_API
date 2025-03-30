const Student = require('../models/student');
const Registration = require('../models/registration');

exports.retrieveForNotifications = async (req, res, next) => {
  try {
    const { teacher, notification } = req.body;
    if (!teacher || !notification) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const mentionedEmails = (notification.match(/@([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g) || [])
      .map(email => email.substring(1));

    const registeredStudents = await Registration.findStudentsByTeacher(teacher);
    const validMentionedStudents = await Student.findActiveByEmails(mentionedEmails);

    const eligibleStudents = [...new Set([...registeredStudents, ...validMentionedStudents])];
    res.status(200).json({ recipients: eligibleStudents });
  } catch (error) {
    next(error);
  }
};