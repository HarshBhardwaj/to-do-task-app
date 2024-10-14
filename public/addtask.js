document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevent the form from submitting traditionally

  const formData = new FormData(e.target); // Collect form data using FormData

  try {
    const response = await fetch("/add-task", {
      method: "POST",
      body: formData, // Send form-encoded data
    });

    if (response.ok) {
      const result = await response.text();
      document.body.innerHTML = result; // Replace body with response (reload tasks)
    } else {
      console.error("Failed to add task:", response.status);
    }
  } catch (error) {
    console.error("Error adding task:", error);
  }
});
