const pool = require('../config/db');

class Student {
  static async createIfNotExists(email) {
    await pool.query('INSERT IGNORE INTO students (email) VALUES (?)', [email]);
  }

  static async suspend(email) {
    const [result] = await pool.query('UPDATE students SET suspended = TRUE WHERE email = ?', [email]);
    return result.affectedRows > 0;
  }

  static async findActiveByEmails(emails) {
    const [rows] = await pool.query('SELECT email FROM students WHERE suspended = FALSE AND email IN (?)', [emails]);
    return rows.map(row => row.email);
  }
}

module.exports = Student;