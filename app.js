const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const mongoose = require("mongoose"); // Import Mongoose
const bcrypt = require("bcryptjs");
const app = express();
const port = 3001;



// Session middlewares
app.use(bodyParser.urlencoded({ extended: true })); // Make sure this line is included
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
  })
);

// Add this line to parse JSON bodies
app.use(bodyParser.json());

// Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * All database related settings
 */
// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://taskappHarsh:taskCluster123@cluster70072.xnwni.mongodb.net/todoDB?retryWrites=true&w=majority&appName=Cluster70072"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// Define a user schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// Define a schema for tasks
const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  completed: {
    type: Boolean,
    default: false, // New field to track if the task is completed
  },
});

// Create a Task model based on the schema
const Task = mongoose.model("Task", taskSchema);
module.exports = Task;

// This is to get secure password
// const bcrypt = require("bcryptjs");

// Main page that gives users option to login or register
app.get("/", (req, res) => {
  res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome</title>
        <style>
          /* Apply flexbox to the body to center content */
          body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh; /* Full viewport height */
            margin: 0; /* Remove default body margin */
            font-family: Arial, sans-serif;
            background-image: url('https://images.inc.com/uploaded_files/image/1920x1080/getty_638884198_366705.jpg');
            background-size: cover; /* Ensure the image covers the entire background */
            background-position: center; /* Center the image */
            background-repeat: no-repeat; /* Prevent the image from repeating */
          }
  
          /* Overlay effect for readability */
          .overlay {
            background-color: rgba(0, 0, 0, 0.5); /* Dark transparent overlay */
            padding: 20px;
            border-radius: 10px;
          }
  
          /* Container to hold the text and buttons */
          .container {
            text-align: center; /* Center align text inside the container */
            color: white; /* Set text color to white for visibility */
          }
  
          /* Button Styles */
          .btn {
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            color: white;
            background-color: lightblue;
            border: none;
            border-radius: 50px; /* Oval shape */
            cursor: pointer;
            text-decoration: none; /* Remove underline from link buttons */
            margin: 10px;
            transition: background-color 0.3s ease;
          }
  
          /* Hover effect */
          .btn:hover {
            background-color: #5daeff; /* Darker blue on hover */
          }
        </style>
      </head>
      <body>
        <div class="overlay">
          <div class="container">
            <h1>Welcome to the To-Do App</h1>
            <a href="/login" class="btn">Login</a>
            <a href="/register" class="btn">Register</a>
          </div>
        </div>
      </body>
      </html>
    `);
});

/**
 * Logic to handle the Login route
 * and Login POST request
 */

// Login GET request
app.get("/login", (req, res) => {
  res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login</title>
        <style>
          body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
          }
  
          .container {
            text-align: center;
            background-color: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          }
  
          .btn {
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            color: white;
            background-color: lightblue;
            border: none;
            border-radius: 50px;
            cursor: pointer;
            text-decoration: none;
            margin-top: 10px;
            transition: background-color 0.3s ease;
          }
  
          .btn:hover {
            background-color: #5daeff;
          }
  
          input[type="text"], input[type="password"] {
            padding: 10px;
            margin: 10px;
            width: 80%;
            border: 1px solid #ccc;
            border-radius: 5px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Login</h1>
          <form action="/login" method="POST">
            <input type="text" name="username" placeholder="Username" required><br>
            <input type="password" name="password" placeholder="Password" required><br>
            <button type="submit" class="btn">Login</button>
          </form>
        </div>
      </body>
      </html>
    `);
});

// Login POST request
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(200).send(`
          <h1>User not found</h1>
          <a href="/register">Register</a>
        `);
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      // When the password is incorrect, return the following:
      // When the password is incorrect, return the following:
      return res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invalid Credentials</title>
      <style>
        body {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh; /* Full viewport height */
          margin: 0;
          font-family: Arial, sans-serif;
          background-color: #f0f0f0;
        }
  
        .container {
          text-align: center;
          background-color: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
  
        /* Button styling */
        .btn {
          display: inline-block;
          padding: 10px 20px;
          font-size: 16px;
          color: white;
          background-color: lightblue;
          border: none;
          border-radius: 50px; /* Oval shape */
          cursor: pointer;
          text-decoration: none;
          margin-top: 10px;
          margin-right: 10px; /* Small space between buttons */
          transition: background-color 0.3s ease;
        }
  
        .btn:hover {
          background-color: #5daeff; /* Darker blue on hover */
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Invalid Credentials</h1>
        <p>Forgot your password?</p>
        <a href="/forgot-password" class="btn">Forgot Password</a> <!-- Forgot Password button -->
        <a href="/login" class="btn">Return to Log In</a> <!-- Return to Log In button -->
      </div>
    </body>
    </html>
  `);
    }

    // If login is successful, log the user in and redirect
    req.session.userId = user._id;

    // Instead of directly redirecting, send a script to the browser to handle redirection
    return res.status(200).send(`
        <h1>Login successful!</h1>
        <p>Redirecting to your tasks...</p>
        <script>
          setTimeout(() => {
            window.location.href = '/tasks';
          }, 3000); // Redirect after 3 seconds
        </script>
      `);
  } catch (err) {
    console.error("Error during login:", err);
    return res
      .status(500)
      .send("An error occurred during login. Please try again later.");
  }
});

/**
 * Logic to handle the Logout route
 * and Logout GET request
 */

// Logout Route
app.get("/logout", (req, res) => {
  req.session.destroy(); // Destroy the session
  res.redirect("/login"); // Redirect to the login page
});

/**
 * Logic for the Register route
 */

// Register GET request
app.get("/register", (req, res) => {
  console.log("GET /register route hit");
  res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Register</title>
        <style>
          body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
          }
  
          .container {
            text-align: center;
            background-color: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          }
  
          .btn {
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            color: white;
            background-color: lightblue;
            border: none;
            border-radius: 50px;
            cursor: pointer;
            text-decoration: none;
            margin-top: 10px;
            transition: background-color 0.3s ease;
          }
  
          .btn:hover {
            background-color: #5daeff;
          }
  
          input[type="text"], input[type="password"] {
            padding: 10px;
            margin: 10px;
            width: 80%;
            border: 1px solid #ccc;
            border-radius: 5px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Register</h1>
          <form action="/register" method="POST">
            <input type="text" name="username" placeholder="Username" required><br>
            <input type="password" name="password" placeholder="Password" required><br>
            <button type="submit" class="btn">Register</button>
          </form>
        </div>
      </body>
      </html>
    `);
});

// Register POST request
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      // If user already exists, show a message and login button
      return res.send(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>User Already Exists</title>
            <style>
              body {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                font-family: Arial, sans-serif;
                background-color: #f0f0f0;
              }
  
              .container {
                text-align: center;
                background-color: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
              }
  
              .btn {
                display: inline-block;
                padding: 10px 20px;
                font-size: 16px;
                color: white;
                background-color: lightblue;
                border: none;
                border-radius: 50px;
                cursor: pointer;
                text-decoration: none;
                margin-top: 10px;
                transition: background-color 0.3s ease;
              }
  
              .btn:hover {
                background-color: #5daeff;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>User already exists</h1>
              <p>Please login to your account.</p>
              <a href="/login" class="btn">Login</a>
            </div>
          </body>
          </html>
        `);
    }

    // If the user does not exist, hash the password and create a new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });

    // Save the new user to the database
    await newUser.save();

    // Set the userId in the session and redirect to the tasks page
    req.session.userId = newUser._id;
    res.redirect("/tasks");
  } catch (err) {
    console.error(err);
    res.send("Error during registration.");
  }
});

/**
 * Handling all the middleware and routes
 */

// Middleware to check if the user is logged in
function requireLogin(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.redirect("/login"); // Redirect to login if not logged in
  }
  next();
}



/**
 * Handling of the tasks routes
 */
// GET /tasks route - Protected route
app.get("/tasks", requireLogin, async (req, res) => {
  try {
    // Fetch tasks for the logged-in user
    const tasks = await Task.find({ user: req.session.userId });

    // Render the tasks as checkboxes and include the form to add new tasks
    res.status(200).send(`
      <h1>Your Tasks</h1>

      <!-- Task Addition Form -->
      <form id="task-form">
        <input type="text" name="task" placeholder="New Task" required>
        <button type="submit">Add Task</button>
      </form>

      <!-- Task List as a Checklist -->
      <ul id="task-list">
        ${tasks
          .map(
            (task) => `
          <li>
            <input type="checkbox" data-task-id="${task._id}" ${
              task.completed ? "checked" : ""
            }>
            <span style="text-decoration: ${
              task.completed ? "line-through" : "none"
            }">
              ${task.name}
            </span>
          </li>
        `
          )
          .join("")}
      </ul>

      <a href="/logout">Logout</a>
      <script src="/tasks.js"></script> <!-- Link to client-side JS -->
    `);
  } catch (error) {
    console.error("Error loading tasks:", error);
    res.status(500).send("Error loading tasks.");
  }
});

// POST /add-task route - Protected route
app.post("/add-task", requireLogin, async (req, res) => {
  console.log("Session Data:", req.session); // Log session
  console.log("Request Body:", req.body); // Log request body

  const { task } = req.body; // Extract task from the body
  const userId = req.session.userId;

  if (!task || !userId) {
    return res.status(400).send("Task or user ID is missing.");
  }

  try {
    const newTask = new Task({
      name: task,
      user: userId,
    });

    await newTask.save();
    res.status(200).json(newTask); // Return the new task as JSON
  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).send("Failed to add task.");
  }
});

// POST /update-task route - Protected route
app.post("/update-task/:id", requireLogin, async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  try {
    // Find the task by ID and update its completion status
    await Task.findByIdAndUpdate(id, { completed });

    res.status(200).send("Task updated successfully.");
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).send("Failed to update task.");
  }
});

/**
 * Forgot password route logic
 * and Forgot password POST request
 */
app.get("/forgot-password", (req, res) => {
  res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Forgot Password</title>
      </head>
      <body>
        <h1>Forgot Password</h1>
        <p>Please contact support or provide a way to reset the password here.</p>
      </body>
      </html>
    `);
});

// Serve static files (CSS, JS, etc.)
app.use(express.static("public"));

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
