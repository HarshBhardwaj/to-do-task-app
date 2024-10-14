const todoInput = document.getElementById('todo-input');
const addButton = document.getElementById('add-button');
const todoList = document.getElementById('todo-list');

addButton.addEventListener('click', () => {
  const taskText = todoInput.value;

  if (taskText) {
    const newTask = document.createElement('li');
    newTask.textContent = taskText;
    todoList.appendChild(newTask);
    
    todoInput.value = ''; // Clear the input after adding the task
  }
});

// // Adding event listener for the login form
// const loginForm = document.querySelector('#login-form');

// loginForm.addEventListener('submit', async (e) => {
//   e.preventDefault(); // Prevent form from reloading the page

//   const formData = new FormData(loginForm);
//   const data = {
//     username: formData.get('username'),
//     password: formData.get('password')
//   };

//   try {
//     const response = await fetch('/login', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(data),
//     });

//     if (!response.ok) {
//       throw new Error('Login failed');
//     }

//     const result = await response.text(); // or response.json() if returning JSON
//     document.body.innerHTML = result; // Replace the body content with the result
//   } catch (error) {
//     console.error('Error:', error.message);
//     alert('An error occurred during login.');
//   }
// });

