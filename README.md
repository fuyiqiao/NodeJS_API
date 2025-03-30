# NodeJS_API

## Features
- **Register Students**: Link students to one or more teachers.
- **Retrieve Common Students**: Find students registered to all specified teachers.
- **Suspend Students**: Mark a student as suspended. (assume the suspension applies for all teachers)
- **Notification Eligibility**: Identify students eligible to receive notifications (@mentioned, or registered and not suspended).

---

## Setup

### Installation
1. Clone the repository:
   ```bash
   git clone git@github.com:fuyiqiao/NodeJS_API.git
   cd NodeJS_API
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Edit .env file:
   ```bash
   DB_HOST=localhost
   DB_USER="your_mysql_username"
   DB_PASSWORD="your_mysql_password"
   DB_NAME=workpal_db
   PORT=3000
   ```
4. Set up the MySQL database:
    ```sql
    CREATE DATABASE workpal_db;
    USE workpal_db;

    -- Run in MySQL CLI
    CREATE TABLE teachers (email VARCHAR(255) PRIMARY KEY);
    CREATE TABLE students (
        email VARCHAR(255) PRIMARY KEY,
        suspended BOOLEAN DEFAULT FALSE
    );
    CREATE TABLE registrations (
        teacher_email VARCHAR(255),
        student_email VARCHAR(255),
        PRIMARY KEY (teacher_email, student_email),
        FOREIGN KEY (teacher_email) REFERENCES teachers(email) ON DELETE CASCADE,
        FOREIGN KEY (student_email) REFERENCES students(email) ON DELETE CASCADE
    );

    -- Insert initial data
    INSERT INTO students VALUES ('student1@gmail.com', FALSE);
    INSERT INTO students VALUES ('student2@gmail.com', FALSE);
    INSERT INTO students VALUES ('student3@gmail.com', FALSE);

    INSERT INTO teachers VALUES ('teacher1@gmail.com');
    INSERT INTO teachers VALUES ('teacher2@gmail.com');
    INSERT INTO teachers VALUES ('teacher3@gmail.com');
    ```
5. Start application
    ```bash
    npm start
    ```

## API Documentation
1. Register Students
    ```
    POST localhost:3000/api/register
    ```
    request body:
    ```json
    {
    "teacher": "teacher1@gmail.com",
    "students": ["student1@gmail.com", "student2@gmail.com"]
    }
    ```
    >Success: HTTP 204 (No Content)
2. Retrieve Common Students
    ```
    GET localhost:3000/api/commonstudents
    ```
    query parameters:
    ```json
    teacher=teacher1@gmail.com&teacher=teacher2@gmail.com
    ```
    Response:
    ``` json
    {
        "students": ["student1@gmail.com", "student2@gmail.com"]
    }
    ```
3. Suspend a Student
    ```
    POST localhost:3000/api/suspend
    ```
    request body:
    ```json
    {
        "student": "student1@gmail.com"
    }
    ```
    >Success: HTTP 204 (No Content)
4. Retrieve Notification Recipients
    ```
    POST localhost:3000/api/retrievefornotifications
    ```
    request body:
    ```json
    {
        "teacher": "teacher1@gmail.com",
        "notification": "Hello @student1@gmail.com"
    }
    ```
    Response:
    ``` json
    {
        "recipients": ["student1@gmail.com", "student2@gmail.com"]
    }
    ```

## Testing 
To run unit tests, use:
 ```
npm test
```