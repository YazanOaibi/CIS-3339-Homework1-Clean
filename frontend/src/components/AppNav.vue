<template>
    <header class="app-header">
      <h1>Student Management System</h1>
  
      <nav aria-label="Main navigation">
        <RouterLink to="/">
          Students
        </RouterLink>
  
        <RouterLink to="/courses">
          Courses
        </RouterLink>
      </nav>
    </header>
  </template>
  
  <style scoped>
  .app-header {
    margin-bottom: 30px;
  }
  
  .app-header h1 {
    margin-bottom: 12px;
  }
  
  nav {
    display: flex;
    gap: 16px;
  }
  
  nav a {
    font-weight: 600;
    text-decoration: none;
  }
  
  nav a.router-link-active {
    text-decoration: underline;
  }
  </style>