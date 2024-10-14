document.querySelector("#login-form").addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevent form from submitting traditionally

  const formData = new FormData(e.target);
  const data = {
    username: formData.get("username"),
    password: formData.get("password"),
  };

  try {
    const response = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.text(); // Capture the response from the server

    // Replace the page content with the result (this could include the redirection script)
    document.body.innerHTML = result;
  } catch (error) {
    console.error("Error during login:", error);
  }
});
