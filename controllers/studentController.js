import Student from "@/models/Student";
import Course from "@/models/Course";


// Get Enrolled Courses
exports.getEnrolledCourses = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).populate('courses');
    res.status(200).json(student.courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching enrolled courses', error: error.message });
  }
};

// Enroll in Course
exports.enrollInCourse = async (req, res) => {
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId);
    const student = await Student.findById(req.user.id);

    if (!course || !student) {
      return res.status(404).json({ message: 'Course or Student not found' });
    }

    student.courses.push(courseId);
    await student.save();
    res.status(200).json({ message: 'Enrolled in course successfully!', course });
  } catch (error) {
    res.status(500).json({ message: 'Error enrolling in course', error: error.message });
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  const { phone, profilePicture } = req.body;

  try {
    const student = await Student.findById(req.user.id);
    if (phone) student.phone = phone;
    if (profilePicture) student.profilePicture = profilePicture;
    await student.save();
    res.status(200).json({ message: 'Profile updated successfully', student });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

// Get Grades
exports.getGrades = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).populate('courses');
    const grades = student.courses.map(course => ({
      courseName: course.name,
      grade: course.grade || 'Not graded yet',
    }));
    res.status(200).json(grades);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching grades', error: error.message });
  }
};
