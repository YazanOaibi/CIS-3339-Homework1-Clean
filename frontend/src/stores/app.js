import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const students = ref([])
  const courses = ref([])

  const loadStudents = async () => {
    const response = await fetch('/api/students')
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Unable to load students')
    }

    students.value = data
  }

  const loadCourses = async () => {
    const response = await fetch('/api/courses')
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Unable to load courses')
    }

    courses.value = data
  }

  return {
    students,
    courses,
    loadStudents,
    loadCourses,
  }
})