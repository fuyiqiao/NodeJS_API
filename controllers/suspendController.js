const Student = require('../models/student');

exports.suspend = async (req, res, next) => {
  try {
    const { student } = req.body;
    if (!student) {
      return res.status(400).json({ message: 'Student email required' });
    }

    const success = await Student.suspend(student);
    if (!success) return res.status(404).json({ message: 'Student not found' });

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};