const pool = require('../config/db');

class Teacher {
  static async createIfNotExists(email) {
    await pool.query('INSERT IGNORE INTO teachers (email) VALUES (?)', [email]);
  }
}

module.exports = Teacher;