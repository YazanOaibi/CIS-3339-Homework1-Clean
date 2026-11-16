require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const Student = require('./models/Student');
const Course = require('./models/Course');
const Enrollment = require('./models/Enrollment');

const app = express();

app.use(cors());
app.use(express.json());

// -------------------- DATABASE --------------------

const MONGODB_URI =
    process.env.MONGODB_URI ||
    'mongodb://127.0.0.1:27017/cis3339_homework1';

const PORT = process.env.PORT || 3000;

async function connectDatabase() {
    try {
        await mongoose.connect(MONGODB_URI);

        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}

// -------------------- STUDENTS --------------------

// List all students
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find().sort({
            name: 1
        });

        const result = students.map((student) => ({
            name: student.name,
            id: student.studentId,
            phone: student.phone,
            zip: student.zip
        }));

        res.status(200).json(result);
    } catch (error) {
        console.error('Error listing students:', error);

        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// Search for a student by name
app.post('/api/find-student', async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || !String(name).trim()) {
            return res.status(400).json({
                error: 'Student name is required'
            });
        }

        const student = await Student.findOne({
            name: String(name).trim()
        });

        if (!student) {
            return res.status(404).json({
                error: 'Student not found'
            });
        }

        res.status(200).json({
            name: student.name,
            id: student.studentId,
            phone: student.phone,
            zip: student.zip
        });
    } catch (error) {
        console.error('Error finding student:', error);

        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// Add a student
app.post('/api/add-student', async (req, res) => {
    try {
        const { name, id, phone, zip } = req.body;

        if (
            !name ||
            !id ||
            !phone ||
            !zip ||
            !String(name).trim() ||
            !String(id).trim() ||
            !String(phone).trim() ||
            !String(zip).trim()
        ) {
            return res.status(400).json({
                error: 'All fields (name, id, phone, zip) are required'
            });
        }

        const existingStudent = await Student.findOne({
            studentId: String(id).trim()
        });

        if (existingStudent) {
            return res.status(409).json({
                error: 'Student ID already exists'
            });
        }

        const student = await Student.create({
            name: String(name).trim(),
            studentId: String(id).trim(),
            phone: String(phone).trim(),
            zip: String(zip).trim()
        });

        res.status(201).json({
            message: 'Student added successfully',
            student: {
                name: student.name,
                id: student.studentId,
                phone: student.phone,
                zip: student.zip
            }
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                error: 'Student ID already exists'
            });
        }

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                error: error.message
            });
        }

        console.error('Error adding student:', error);

        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// Delete a student
app.post('/api/delete-student', async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || !String(name).trim()) {
            return res.status(400).json({
                error: 'Student name is required'
            });
        }

        const student = await Student.findOne({
            name: String(name).trim()
        });

        if (!student) {
            return res.status(404).json({
                error: 'Student not found'
            });
        }

        await Enrollment.deleteMany({
            student: student._id
        });

        await Student.deleteOne({
            _id: student._id
        });

        res.status(200).json({
            message: 'Student deleted successfully',
            student: {
                name: student.name,
                id: student.studentId,
                phone: student.phone,
                zip: student.zip
            }
        });
    } catch (error) {
        console.error('Error deleting student:', error);

        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// -------------------- COURSES --------------------

// List all courses
app.get('/api/courses', async (req, res) => {
    try {
        const courses = await Course.find().sort({
            courseId: 1
        });

        const result = courses.map((course) => ({
            classId: course.courseId,
            className: course.courseName
        }));

        res.status(200).json(result);
    } catch (error) {
        console.error('Error listing courses:', error);

        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// Add a course
app.post('/api/add-course', async (req, res) => {
    try {
        const { classId, className } = req.body;

        if (
            !classId ||
            !className ||
            !String(classId).trim() ||
            !String(className).trim()
        ) {
            return res.status(400).json({
                error: 'Class ID and Class Name are required'
            });
        }

        const existingCourse = await Course.findOne({
            courseId: String(classId).trim()
        });

        if (existingCourse) {
            return res.status(409).json({
                error: 'Course ID already exists'
            });
        }

        const course = await Course.create({
            courseId: String(classId).trim(),
            courseName: String(className).trim()
        });

        res.status(201).json({
            message: 'Course added successfully',
            course: {
                classId: course.courseId,
                className: course.courseName
            }
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                error: 'Course ID already exists'
            });
        }

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                error: error.message
            });
        }

        console.error('Error adding course:', error);

        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// Delete a course
app.post('/api/delete-course', async (req, res) => {
    try {
        const { classId } = req.body;

        if (!classId || !String(classId).trim()) {
            return res.status(400).json({
                error: 'Class ID is required'
            });
        }

        const course = await Course.findOne({
            courseId: String(classId).trim()
        });

        if (!course) {
            return res.status(404).json({
                error: 'Course not found'
            });
        }

        await Enrollment.deleteMany({
            course: course._id
        });

        await Course.deleteOne({
            _id: course._id
        });

        res.status(200).json({
            message: 'Course deleted successfully',
            course: {
                classId: course.courseId,
                className: course.courseName
            }
        });
    } catch (error) {
        console.error('Error deleting course:', error);

        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// -------------------- ENROLLMENTS --------------------

// Enroll a student in a course
app.post('/api/enroll-student', async (req, res) => {
    try {
        const { studentId, classId } = req.body;

        if (
            !studentId ||
            !classId ||
            !String(studentId).trim() ||
            !String(classId).trim()
        ) {
            return res.status(400).json({
                error: 'Student and course are required'
            });
        }

        const student = await Student.findOne({
            studentId: String(studentId).trim()
        });

        if (!student) {
            return res.status(404).json({
                error: 'Student not found'
            });
        }

        const course = await Course.findOne({
            courseId: String(classId).trim()
        });

        if (!course) {
            return res.status(404).json({
                error: 'Course not found'
            });
        }

        const existingEnrollment = await Enrollment.findOne({
            student: student._id,
            course: course._id
        });

        if (existingEnrollment) {
            return res.status(409).json({
                error: 'Student is already enrolled in this course'
            });
        }

        await Enrollment.create({
            student: student._id,
            course: course._id
        });

        res.status(201).json({
            message: 'Student enrolled successfully'
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                error: 'Student is already enrolled in this course'
            });
        }

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                error: error.message
            });
        }

        console.error('Error enrolling student:', error);

        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// List students enrolled in a course
app.post('/api/students-in-course', async (req, res) => {
    try {
        const { classId } = req.body;

        if (!classId || !String(classId).trim()) {
            return res.status(400).json({
                error: 'Course is required'
            });
        }

        const course = await Course.findOne({
            courseId: String(classId).trim()
        });

        if (!course) {
            return res.status(404).json({
                error: 'Course not found'
            });
        }

        const enrollments = await Enrollment.find({
            course: course._id
        }).populate('student');

        const students = enrollments
            .filter((enrollment) => enrollment.student)
            .map((enrollment) => ({
                name: enrollment.student.name,
                id: enrollment.student.studentId,
                phone: enrollment.student.phone,
                zip: enrollment.student.zip
            }));

        res.status(200).json(students);
    } catch (error) {
        console.error('Error listing students in course:', error);

        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// -------------------- API FALLBACK --------------------

app.use('/api', (req, res) => {
    res.status(404).json({
        error: 'API route not found'
    });
});

// -------------------- PRODUCTION FRONTEND --------------------

const frontendDistPath = path.join(
    __dirname,
    '..',
    'frontend',
    'dist'
);

app.use(express.static(frontendDistPath));

// Vue Router history fallback.
// This allows refreshing /courses without getting a 404.
app.use((req, res, next) => {
    if (req.method !== 'GET') {
        return next();
    }

    res.sendFile(
        path.join(frontendDistPath, 'index.html'),
        (error) => {
            if (error) {
                next(error);
            }
        }
    );
});

// -------------------- START SERVER --------------------

async function startServer() {
    await connectDatabase();

    app.listen(PORT, () => {
        console.log(
            `Server is running on http://localhost:${PORT}`
        );
    });
}

startServer();