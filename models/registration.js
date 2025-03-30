const pool = require('../config/db');

class Registration {
  static async register(teacherEmail, studentEmails) {
    const values = studentEmails.map(studentEmail => [teacherEmail, studentEmail]);
    await pool.query('INSERT IGNORE INTO registrations (teacher_email, student_email) VALUES ?', [values]);
  }

  static async findCommonStudents(teacherEmails) {
    const [rows] = await pool.query(`
      SELECT student_email 
      FROM registrations 
      WHERE teacher_email IN (?) 
      GROUP BY student_email 
      HAVING COUNT(DISTINCT teacher_email) = ?`, 
      [teacherEmails, teacherEmails.length]
    );
    return rows.map(row => row.student_email);
  }

  static async findStudentsByTeacher(teacherEmail) {
    const [rows] = await pool.query('SELECT student_email FROM registrations WHERE teacher_email = ?', [teacherEmail]);
    return rows.map(row => row.student_email);
  }
}

module.exports = Registration;