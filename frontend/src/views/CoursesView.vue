<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '../stores/app'
import AppNav from '../components/AppNav.vue'
import StatusMessage from '../components/StatusMessage.vue'

const appStore = useAppStore()
const { students, courses } = storeToRefs(appStore)

const classId = ref('')
const className = ref('')

const selectedStudent = ref('')
const selectedCourse = ref('')

const selectedListCourse = ref('')
const studentsInCourse = ref([])

const message = ref('')
const messageType = ref('info')
const loading = ref(false)

const showMessage = (text, type = 'info') => {
  message.value = text
  messageType.value = type
}

// Load all courses from Pinia
const listCourses = async () => {
  try {
    await appStore.loadCourses()
  } catch (error) {
    console.error(error)
    showMessage(error.message, 'error')
  }
}

// Load all students from Pinia
const loadStudents = async () => {
  try {
    await appStore.loadStudents()
  } catch (error) {
    console.error(error)
    showMessage(error.message, 'error')
  }
}

// Add a course
const addCourse = async () => {
  message.value = ''

  if (
    !classId.value.trim() ||
    !className.value.trim()
  ) {
    showMessage('Class ID and Class Name are required.', 'error')
    return
  }

  loading.value = true

  try {
    const response = await fetch('/api/add-course', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        classId: classId.value,
        className: className.value,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      showMessage(data.error, 'error')
      return
    }

    classId.value = ''
    className.value = ''

    await appStore.loadCourses()

    showMessage(data.message, 'success')
  } catch (error) {
    console.error(error)
    showMessage('Unable to connect to the server.', 'error')
  } finally {
    loading.value = false
  }
}

// Delete a course
const deleteCourse = async (courseId) => {
  message.value = ''
  loading.value = true

  try {
    const response = await fetch('/api/delete-course', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        classId: courseId,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      showMessage(data.error, 'error')
      return
    }

    await appStore.loadCourses()

    if (selectedListCourse.value === courseId) {
      selectedListCourse.value = ''
      studentsInCourse.value = []
    }

    showMessage(data.message, 'success')
  } catch (error) {
    console.error(error)
    showMessage('Unable to connect to the server.', 'error')
  } finally {
    loading.value = false
  }
}

// Enroll student
const enrollStudent = async () => {
  message.value = ''

  if (
    !selectedStudent.value ||
    !selectedCourse.value
  ) {
    showMessage('Student and course are required.', 'error')
    return
  }

  loading.value = true

  try {
    const response = await fetch('/api/enroll-student', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        studentId: selectedStudent.value,
        classId: selectedCourse.value,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      showMessage(data.error, 'error')
      return
    }

    selectedStudent.value = ''
    selectedCourse.value = ''

    showMessage(data.message, 'success')
  } catch (error) {
    console.error(error)
    showMessage('Unable to connect to the server.', 'error')
  } finally {
    loading.value = false
  }
}

// List students enrolled in course
const listStudentsInCourse = async () => {
  message.value = ''
  studentsInCourse.value = []

  if (!selectedListCourse.value) {
    showMessage('Please select a course.', 'error')
    return
  }

  loading.value = true

  try {
    const response = await fetch(
      '/api/students-in-course',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          classId: selectedListCourse.value,
        }),
      },
    )

    const data = await response.json()

    if (!response.ok) {
      showMessage(data.error, 'error')
      return
    }

    studentsInCourse.value = data

    if (data.length === 0) {
      showMessage(
        'No students are enrolled in this course.',
        'info',
      )
    } else {
      showMessage(
        'Students loaded successfully.',
        'success',
      )
    }
  } catch (error) {
    console.error(error)
    showMessage('Unable to connect to the server.', 'error')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  loading.value = true

  await Promise.all([
    listCourses(),
    loadStudents(),
  ])

  loading.value = false
})
</script>

<template>
  <main>
    <AppNav />

    <StatusMessage
      :message="message"
      :type="messageType"
    />

    <p v-if="loading">
      Loading...
    </p>

    <h2>Add a Course</h2>

    <label for="classId">
      Class ID:
    </label>

    <input
      id="classId"
      v-model="classId"
      type="text"
    />

    <label for="className">
      Class Name:
    </label>

    <input
      id="className"
      v-model="className"
      type="text"
    />

    <button
      :disabled="loading"
      @click="addCourse"
    >
      Add Course
    </button>

    <hr />

    <h2>Courses List</h2>

    <button
      :disabled="loading"
      @click="listCourses"
    >
      List Courses
    </button>

    <table v-if="courses.length > 0">
      <thead>
        <tr>
          <th>Class ID</th>
          <th>Class Name</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="course in courses"
          :key="course.classId"
        >
          <td>{{ course.classId }}</td>
          <td>{{ course.className }}</td>
          <td>
            <button
              :disabled="loading"
              @click="deleteCourse(course.classId)"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else>
      No courses available.
    </p>

    <hr />

    <h2>Enroll Student in Course</h2>

    <label for="studentSelect">
      Select Student:
    </label>

    <select
      id="studentSelect"
      v-model="selectedStudent"
    >
      <option value="">
        Select Student
      </option>

      <option
        v-for="student in students"
        :key="student.id"
        :value="student.id"
      >
        {{ student.name }} ({{ student.id }})
      </option>
    </select>

    <label for="courseSelect">
      Select Course:
    </label>

    <select
      id="courseSelect"
      v-model="selectedCourse"
    >
      <option value="">
        Select Course
      </option>

      <option
        v-for="course in courses"
        :key="course.classId"
        :value="course.classId"
      >
        {{ course.className }} ({{ course.classId }})
      </option>
    </select>

    <button
      :disabled="loading"
      @click="enrollStudent"
    >
      Enroll Student
    </button>

    <hr />

    <h2>Students in Course</h2>

    <label for="listCourseSelect">
      Select Course:
    </label>

    <select
      id="listCourseSelect"
      v-model="selectedListCourse"
    >
      <option value="">
        Select Course
      </option>

      <option
        v-for="course in courses"
        :key="course.classId"
        :value="course.classId"
      >
        {{ course.className }} ({{ course.classId }})
      </option>
    </select>

    <button
      :disabled="loading"
      @click="listStudentsInCourse"
    >
      List Students
    </button>

    <table v-if="studentsInCourse.length > 0">
      <thead>
        <tr>
          <th>Name</th>
          <th>ID</th>
          <th>Phone</th>
          <th>Zip</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="student in studentsInCourse"
          :key="student.id"
        >
          <td>{{ student.name }}</td>
          <td>{{ student.id }}</td>
          <td>{{ student.phone }}</td>
          <td>{{ student.zip }}</td>
        </tr>
      </tbody>
    </table>
  </main>
</template>