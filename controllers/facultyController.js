import Student from "@/models/Student";
import Course from "@/models/Course";


// Create Course
exports.createCourse = async (req, res) => {
  const { name, description } = req.body;
  
  try {
    const newCourse = new Course({ name, description, facultyId: req.user.id, status: 'pending' });
    await newCourse.save();
    res.status(201).json({ message: 'Course created successfully!', course: newCourse });
  } catch (error) {
    res.status(500).json({ message: 'Error creating course', error: error.message });
  }
};

// Get Courses (Faculty)
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ facultyId: req.user.id });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
};

// Enroll/Approve/Reject Student
exports.enrollStudent = async (req, res) => {
  const { courseId, studentId } = req.params;

  try {
    const course = await Course.findById(courseId);
    const student = await Student.findById(studentId);

    if (!course || !student) {
      return res.status(404).json({ message: 'Course or Student not found' });
    }

    if (req.body.action === 'approve') {
      course.students.push(studentId); // Enroll student
    } else if (req.body.action === 'reject') {
      const index = course.students.indexOf(studentId);
      if (index !== -1) {
        course.students.splice(index, 1); // Remove student from course
      }
    }

    await course.save();
    res.status(200).json({ message: 'Student enrollment updated successfully', course });
  } catch (error) {
    res.status(500).json({ message: 'Error enrolling student', error: error.message });
  }
};
