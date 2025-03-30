const Teacher = require('../models/teacher');
const Student = require('../models/student');
const Registration = require('../models/registration');

exports.register = async (req, res, next) => {
  try {
    const { teacher, students } = req.body;
    if (!teacher || !students || !students.length) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    await Teacher.createIfNotExists(teacher);
    for (student in students) {
        await Student.createIfNotExists(student);
    }
    await Registration.register(teacher, students);

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};