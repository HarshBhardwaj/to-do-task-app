// Handle task addition via AJAX
document.querySelector("#task-form").addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevent traditional form submission

  const taskInput = document.querySelector('input[name="task"]').value;

  try {
    const response = await fetch("/add-task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Ensure JSON format
      },
      body: JSON.stringify({ task: taskInput }), // Send task data as JSON
    });

    if (response.ok) {
      const newTask = await response.json(); // Parse the new task from the server
      const taskList = document.querySelector("#task-list");
      const newTaskElement = document.createElement("li");
      newTaskElement.innerHTML = `
        <input type="checkbox" data-task-id="${newTask._id}">
        <span>${newTask.name}</span>
      `;
      taskList.appendChild(newTaskElement); // Add the new task to the list
    } else {
      console.error("Failed to add task:", response.status);
    }
  } catch (error) {
    console.error("Error adding task:", error);
  }
});

// Handle task completion via AJAX
document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
  checkbox.addEventListener("change", async (e) => {
    const taskId = e.target.getAttribute("data-task-id");
    const completed = e.target.checked;

    try {
      const response = await fetch(`/update-task/${taskId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed }),
      });

      if (response.ok) {
        // Update the UI (e.g., strikethrough for completed tasks)
        e.target.nextElementSibling.style.textDecoration = completed
          ? "line-through"
          : "none";
      } else {
        console.error("Failed to update task:", response.status);
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  });
});
