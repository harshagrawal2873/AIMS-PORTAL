import Student from "@/models/Student";
import  Professor  from "@/models/Professor";
import Course from "@/models/Course";


// Create Student
exports.createStudent = async (req, res) => {
  const { email, name, phone } = req.body;
  
  try {
    const newStudent = new Student({ email, name, phone });
    await newStudent.save();
    res.status(201).json({ message: 'Student created successfully!', student: newStudent });
  } catch (error) {
    res.status(500).json({ message: 'Error creating student', error: error.message });
  }
};

// Create Faculty
exports.createFaculty = async (req, res) => {
  const { email, name, department } = req.body;
  
  try {
    const newFaculty = new Professor({ email, name, department });
    await newFaculty.save();
    res.status(201).json({ message: 'Faculty created successfully!', faculty: newFaculty });
  } catch (error) {
    res.status(500).json({ message: 'Error creating faculty', error: error.message });
  }
};

// Get Courses (pending/approved/rejected)
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find(); // Modify with status filter if needed
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
};

// Approve or Reject Course
exports.approveCourse = async (req, res) => {
  const { courseId } = req.params;
  const { action } = req.body; // 'approve' or 'reject'

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (action === 'approve') {
      course.status = 'approved';
    } else if (action === 'reject') {
      course.status = 'rejected';
    }

    await course.save();
    res.status(200).json({ message: `Course ${action}d successfully!`, course });
  } catch (error) {
    res.status(500).json({ message: 'Error approving/rejecting course', error: error.message });
  }
};

// Get all students (with search params)
exports.getStudents = async (req, res) => {
  const { courseId } = req.query;

  try {
    let students;
    if (courseId) {
      students = await Student.find({ 'courses': courseId });
    } else {
      students = await Student.find();
    }
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
};
