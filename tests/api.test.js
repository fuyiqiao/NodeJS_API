const request = require('supertest');
const app = require('../app');
const pool = require('../config/db');

// Clean up tables before each test
beforeEach(async () => {
  await pool.query('DELETE FROM registrations');
  await pool.query('DELETE FROM students');
  await pool.query('DELETE FROM teachers');
});

afterAll(async () => {
  await pool.end(); // Close the database connection pool
});

describe('POST /api/register', () => {
  it('should register students to a teacher (HTTP 204)', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({
        teacher: 'teacherken@gmail.com',
        students: ['studentjon@gmail.com', 'studenthon@gmail.com']
      });
    expect(res.statusCode).toBe(204);
  });

  it('should return 400 if teacher or students are missing', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({ teacher: 'teacherken@gmail.com' });
    expect(res.statusCode).toBe(400);
  });
});

describe('GET /api/commonstudents', () => {
  it('should return students registered to a single teacher', async () => {
    // Setup test data
    await pool.query('INSERT INTO teachers (email) VALUES ("teacherken@gmail.com")');
    await pool.query('INSERT INTO students (email) VALUES ("studentjon@gmail.com"), ("studenthon@gmail.com")');
    await pool.query(`
      INSERT INTO registrations (teacher_email, student_email)
      VALUES ("teacherken@gmail.com", "studentjon@gmail.com"),
             ("teacherken@gmail.com", "studenthon@gmail.com")
    `);

    const res = await request(app)
      .get('/api/commonstudents?teacher=teacherken%40gmail.com');
    
    expect(res.statusCode).toBe(200);
    expect(res.body.students.sort()).toEqual(['studentjon@gmail.com', 'studenthon@gmail.com'].sort());
  });

  it('should return common students across multiple teachers', async () => {
    // Setup test data
    await pool.query('INSERT INTO teachers (email) VALUES ("teacherken@gmail.com"), ("teacherjoe@gmail.com")');
    await pool.query('INSERT INTO students (email) VALUES ("studentjon@gmail.com"), ("studenthon@gmail.com")');
    await pool.query(`
      INSERT INTO registrations (teacher_email, student_email)
      VALUES ("teacherken@gmail.com", "studentjon@gmail.com"),
             ("teacherjoe@gmail.com", "studentjon@gmail.com")
    `);

    const res = await request(app)
      .get('/api/commonstudents?teacher=teacherken%40gmail.com&teacher=teacherjoe%40gmail.com');
    
    expect(res.statusCode).toBe(200);
    expect(res.body.students).toEqual(['studentjon@gmail.com']);
  });
});

describe('POST /api/suspend', () => {
  it('should suspend a student (HTTP 204)', async () => {
    // Insert a student first
    await pool.query('INSERT INTO students (email) VALUES ("studentjon@gmail.com")');

    const res = await request(app)
      .post('/api/suspend')
      .send({ student: 'studentjon@gmail.com' });
    
    expect(res.statusCode).toBe(204);

    // Verify suspension in the database
    const [rows] = await pool.query('SELECT suspended FROM students WHERE email = "studentjon@gmail.com"');
    expect(rows[0].suspended).toBe(1); // 1 = true in MySQL
  });

  it('should return 404 if student does not exist', async () => {
    const res = await request(app)
      .post('/api/suspend')
      .send({ student: 'nonexistent@gmail.com' });
    
    expect(res.statusCode).toBe(404);
  });
});

describe('POST /api/retrievefornotifications', () => {
  it('should return recipients including mentioned and registered students', async () => {
    // Setup test data
    await pool.query('INSERT INTO teachers (email) VALUES ("teacherken@gmail.com")');
    await pool.query('INSERT INTO students (email) VALUES ("studentjon@gmail.com"), ("studentagnes@gmail.com")');
    await pool.query(`
      INSERT INTO registrations (teacher_email, student_email)
      VALUES ("teacherken@gmail.com", "studentjon@gmail.com")
    `);

    const res = await request(app)
      .post('/api/retrievefornotifications')
      .send({
        teacher: 'teacherken@gmail.com',
        notification: 'Hello @studentagnes@gmail.com @studentjon@gmail.com'
      });
    
    expect(res.statusCode).toBe(200);
    expect(res.body.recipients.sort()).toEqual(['studentjon@gmail.com', 'studentagnes@gmail.com'].sort());
  });

  it('should exclude suspended students', async () => {
    // Insert a suspended student
    await pool.query('INSERT INTO students (email, suspended) VALUES ("studentbob@gmail.com", 1)');

    const res = await request(app)
      .post('/api/retrievefornotifications')
      .send({
        teacher: 'teacherken@gmail.com',
        notification: 'Hello @studentbob@gmail.com'
      });
    
    expect(res.body.recipients).toEqual([]);
  });
});