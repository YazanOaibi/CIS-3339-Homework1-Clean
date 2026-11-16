<script setup>
import { ref } from 'vue'
import { useAppStore } from '../stores/app'
import AppNav from '../components/AppNav.vue'
import StatusMessage from '../components/StatusMessage.vue'

const appStore = useAppStore()

const searchName = ref('')
const foundStudent = ref(null)

const studentName = ref('')
const studentId = ref('')
const studentPhone = ref('')
const studentZip = ref('')

const message = ref('')
const messageType = ref('info')
const loading = ref(false)

const showMessage = (text, type = 'info') => {
  message.value = text
  messageType.value = type
}

// Search for a student
const searchStudent = async () => {
  foundStudent.value = null
  message.value = ''

  if (!searchName.value.trim()) {
    showMessage('Student name is required.', 'error')
    return
  }

  loading.value = true

  try {
    const response = await fetch('/api/find-student', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: searchName.value,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      showMessage(data.error, 'error')
      return
    }

    foundStudent.value = data
    showMessage('Student found successfully.', 'success')
  } catch (error) {
    console.error(error)
    showMessage('Unable to connect to the server.', 'error')
  } finally {
    loading.value = false
  }
}

// Add a student
const addStudent = async () => {
  message.value = ''

  if (
    !studentName.value.trim() ||
    !studentId.value.trim() ||
    !studentPhone.value.trim() ||
    !studentZip.value.trim()
  ) {
    showMessage('All student fields are required.', 'error')
    return
  }

  loading.value = true

  try {
    const response = await fetch('/api/add-student', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: studentName.value,
        id: studentId.value,
        phone: studentPhone.value,
        zip: studentZip.value,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      showMessage(data.error, 'error')
      return
    }

    studentName.value = ''
    studentId.value = ''
    studentPhone.value = ''
    studentZip.value = ''

    await appStore.loadStudents()

    showMessage(data.message, 'success')
  } catch (error) {
    console.error(error)
    showMessage('Unable to connect to the server.', 'error')
  } finally {
    loading.value = false
  }
}

// Delete a student
const deleteStudent = async () => {
  if (!foundStudent.value) {
    return
  }

  message.value = ''
  loading.value = true

  try {
    const response = await fetch('/api/delete-student', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: foundStudent.value.name,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      showMessage(data.error, 'error')
      return
    }

    foundStudent.value = null
    searchName.value = ''

    await appStore.loadStudents()

    showMessage(data.message, 'success')
  } catch (error) {
    console.error(error)
    showMessage('Unable to connect to the server.', 'error')
  } finally {
    loading.value = false
  }
}
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

    <h2>Search for a Student</h2>

    <label for="searchName">
      Student Name:
    </label>

    <input
      id="searchName"
      v-model="searchName"
      type="text"
    />

    <button
      :disabled="loading"
      @click="searchStudent"
    >
      Search
    </button>

    <table v-if="foundStudent">
      <thead>
        <tr>
          <th>Name</th>
          <th>ID</th>
          <th>Phone</th>
          <th>Zip</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>{{ foundStudent.name }}</td>
          <td>{{ foundStudent.id }}</td>
          <td>{{ foundStudent.phone }}</td>
          <td>{{ foundStudent.zip }}</td>
          <td>
            <button
              :disabled="loading"
              @click="deleteStudent"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <hr />

    <h2>Add a Student</h2>

    <label for="studentName">
      Name:
    </label>

    <input
      id="studentName"
      v-model="studentName"
      type="text"
    />

    <label for="studentId">
      ID:
    </label>

    <input
      id="studentId"
      v-model="studentId"
      type="text"
    />

    <label for="studentPhone">
      Phone:
    </label>

    <input
      id="studentPhone"
      v-model="studentPhone"
      type="text"
    />

    <label for="studentZip">
      Zip:
    </label>

    <input
      id="studentZip"
      v-model="studentZip"
      type="text"
    />

    <button
      :disabled="loading"
      @click="addStudent"
    >
      Add Student
    </button>
  </main>
</template>