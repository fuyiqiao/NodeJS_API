const Registration = require('../models/registration');

exports.getCommonStudents = async (req, res, next) => {
  try {
    const teacherEmails = Array.isArray(req.query.teacher) ? req.query.teacher : [req.query.teacher];
    if (!teacherEmails.every(email => email)) {
      return res.status(400).json({ message: 'Invalid teacher emails' });
    }

    const students = await Registration.findCommonStudents(teacherEmails);
    res.status(200).json({ students });
  } catch (error) {
    next(error);
  }
};