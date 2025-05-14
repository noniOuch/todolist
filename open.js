//////////////////////////////////////////////
// Page Navigation
//////////////////////////////////////////////

// This function hides all pages and then displays the page with the specified ID.
function showPage(pageId) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => {
    page.style.display = 'none';
  });
  document.getElementById(pageId).style.display = 'block';
}

// When the window loads, show the tasks page and initialize header and placeholder updates.
window.onload = () => {
  showPage('tasks-page');
  updateHeader();
  updateNoTasksPlaceholder();
};

//////////////////////////////////////////////
// DOM Element References
//////////////////////////////////////////////

// Input and button elements for adding tasks
const taskInput = document.getElementById('task-text');       // Text input for tasks
const dateInput = document.getElementById('due-date');          // Date input for the due date
const submitBtn = document.getElementById('submit-task');       // Button to submit a new task

// Containers for displaying tasks
const taskBox = document.querySelector('.task-box');          // Container for pending tasks
const completedBox = document.querySelector('.completed-box');  // Container for completed tasks

// Element to display messages (e.g., success or error notifications)
const messageBox = document.querySelector('.message');

// Header elements for a dynamic greeting, current time and current date
const greetingEl = document.getElementById('greeting');         // Greeting element ("Good Morning"/"Good Evening")
const currentTimeEl = document.getElementById('current-time');    // Current time display (formatted)
const currentDateEl = document.getElementById('current-date');    // Current date display

// Filter select element for showing all or only completed tasks
const filterSelect = document.getElementById('filterOptions');

// Placeholder element (with a clipboard and X icon) that appears when no tasks are present
const noTasksPlaceholder = document.querySelector('.no-tasks');

//////////////////////////////////////////////
// Dynamic Header Update
//////////////////////////////////////////////

// Updates the greeting, current time, and current date based on the system time.
function updateHeader() {
  const now = new Date();
  const hour = now.getHours();

  // Dynamic greeting: before 12 PM it's "Good Morning", after or at 12 PM it's "Good Evening".
  greetingEl.textContent = hour < 12 ? 'Good Morning' : 'Good Evening';

  // Format and update the current time (hh:mm AM/PM)
  currentTimeEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Format and update the current date (full weekday, month, day, year)
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  currentDateEl.textContent = now.toLocaleDateString(undefined, options);
}

// Update the header every second to keep it current.
setInterval(updateHeader, 1000);

//////////////////////////////////////////////
// Message Display Function
//////////////////////////////////////////////

// This function displays a temporary message in the messageBox element.
function showMessage(text, type = 'info') {
  messageBox.textContent = text;
  messageBox.className = `message ${type}`;
  setTimeout(() => {
    messageBox.textContent = '';
    messageBox.className = 'message';
  }, 3000);
}

//////////////////////////////////////////////
// Calculate Remaining Time Function
//////////////////////////////////////////////

// Calculates the remaining time until the due date.
// Returns a string with the number of days and hours left, or "Time expired" if the date is past.
function calculateRemainingTime(dateStr) {
  const now = new Date();
  const due = new Date(dateStr);
  const diff = due - now;

  if (diff <= 0) return 'Time expired';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  return `${days} day(s) & ${hours} hour(s)`;
}

//////////////////////////////////////////////
// No Tasks Placeholder Update
//////////////////////////////////////////////

// Shows or hides the "no tasks" placeholder based on whether there are any tasks.
function updateNoTasksPlaceholder() {
  if (taskBox.children.length === 0 && completedBox.children.length === 0) {
    noTasksPlaceholder.style.display = 'block';
  } else {
    noTasksPlaceholder.style.display = 'none';
  }
}

//////////////////////////////////////////////
// Add Task Function
//////////////////////////////////////////////

// This function is called when the submit button is clicked.
// It validates the task text and due date, creates a new task list item, and sets up its events.
function addTask() {
  const taskText = taskInput.value.trim();
  const taskDate = dateInput.value;

  if (!taskText || !taskDate) {
    showMessage('Please enter the task and select a date.', 'error');
    return;
  }

  // Hide the no-tasks placeholder as soon as a task is being added.
  noTasksPlaceholder.style.display = 'none';

  const taskItem = document.createElement('li');
  taskItem.className = 'task';

  // Calculate the remaining time until the due date.
  const remainingTime = calculateRemainingTime(taskDate);

  // Define an SVG icon for the delete button (the SVG was taken from the first code snippet).
  const deleteSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="size-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 
      2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 
      0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 
      48.667 0 0 0-7.5 0" />
  </svg>
  `;

  // Construct the content of the new task item.
  taskItem.innerHTML = `
    <label>
      <input type="checkbox">
      <p>${taskText} <span class="task-date">(${taskDate})</span></p>
    </label>
    <div class="settings">
      <span class="time-left">${remainingTime}</span>
      <button class="delete-btn">${deleteSvg}</button>
    </div>
  `;

  //////////////////////////////////////////////////////
  // Delete Task with Confirmation
  //////////////////////////////////////////////////////
  // When the delete button is clicked, show a confirmation dialog before deleting the task.
  const deleteBtn = taskItem.querySelector('.delete-btn');
  deleteBtn.addEventListener('click', () => {
  // Create an overlay element
  const overlay = document.createElement('div');
  overlay.className = 'overlay';

  // Create the modal confirmation box
  const confirmModal = document.createElement('div');
  confirmModal.className = 'confirm-modal';
  confirmModal.innerHTML = `
    <p>Are you sure you want to delete this task?</p>
    <div class="modal-actions">
      <button class="yes">Yes</button>
      <button class="no">No</button>
    </div>
  `;
  overlay.appendChild(confirmModal);
  document.body.appendChild(overlay);

  // If confirmed, remove the task
  confirmModal.querySelector('.yes').addEventListener('click', () => {
    taskItem.remove();
    document.body.removeChild(overlay);
    updateNoTasksPlaceholder();
  });
  // If declined, remove the overlay
  confirmModal.querySelector('.no').addEventListener('click', () => {
    document.body.removeChild(overlay);
  });
});


  //////////////////////////////////////////////////////
  // Toggle Task Completion via Checkbox
  //////////////////////////////////////////////////////
  // When the checkbox is toggled, move the task between the pending and completed lists.
  const checkbox = taskItem.querySelector('input[type="checkbox"]');
  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      completedBox.appendChild(taskItem);
    } else {
      taskBox.appendChild(taskItem);
    }
    updateNoTasksPlaceholder();
  });

  // Append the new task to the pending tasks list.
  taskBox.appendChild(taskItem);
  // Clear the input fields.
  taskInput.value = '';
  dateInput.value = '';
  showMessage('Task added successfully.', 'success');
  updateNoTasksPlaceholder();
}

//////////////////////////////////////////////
// Task Filtering Functionality
//////////////////////////////////////////////

// Filters the tasks based on the dropdown selection ("all" or "completed").
function filterTasks() {
  const filterValue = filterSelect.value;
  if (filterValue === 'completed') {
    // Hide pending tasks and show only completed tasks.
    taskBox.style.display = 'none';
    completedBox.style.display = 'block';
  } else {
    // Show both pending and completed tasks.
    taskBox.style.display = 'block';
    completedBox.style.display = 'block';
  }
}

//////////////////////////////////////////////
// Event Listeners for Task Submission & Filtering
//////////////////////////////////////////////

// When the submit button is clicked, call the addTask function.
submitBtn.addEventListener('click', addTask);
// When the filter selection changes, call the filterTasks function.
filterSelect.addEventListener('change', filterTasks);

// Initial updates for header and placeholder.
updateHeader();
updateNoTasksPlaceholder();

// ------------------------------------------
// Toggle between Sign In and Sign Up forms
// ------------------------------------------

// When the "Sign In" link is clicked, hide the sign‑up form and show the sign‑in form.
document.getElementById('show-signin').addEventListener('click', function(e) {
  e.preventDefault();
  document.getElementById('sign-up-form').style.display = 'none';
  document.getElementById('sign-in-form').style.display = 'block';
  document.getElementById('auth-message').innerText = '';
});

// ------------------------------------------
// Utility / Validation Functions
// ------------------------------------------
function validateEmail(email) {
  const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return regex.test(email);
}

function isStrongPassword(password) {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return regex.test(password);
}

// Simulated database check function via PHP for login.
function checkUserExists(email) {
  return fetch('/checkUser.php?email=' + encodeURIComponent(email))
    .then(response => response.json())
    .then(data => data.exists)
    .catch(err => {
      console.error('Error checking user:', err);
      return false;
    });
}

// ------------------------------------------
// Functions to toggle views within profile-page
// ------------------------------------------
// These functions hide the authentication section and show the profile container,
// or vice versa.
function showProfileContainer() {
  document.querySelector('.auth-section').style.display = 'none';
  document.getElementById('profile-container').style.display = 'block';
}

function showAuthSection() {
  document.querySelector('.auth-section').style.display = 'block';
  document.getElementById('profile-container').style.display = 'none';
}

// ------------------------------------------
// Sign In Handler
// ------------------------------------------
document.getElementById('signin-button').addEventListener('click', function(e) {
  e.preventDefault();
  
  const email = document.getElementById('signin-email').value.trim();
  const password = document.getElementById('signin-password').value;
  
  // Simple validation:
  if (!validateEmail(email)) {
    document.getElementById('auth-message').style.color = 'red';
    document.getElementById('auth-message').innerText = "Please enter a valid email.";
    return;
  }
  if (password.length < 8) {
    document.getElementById('auth-message').style.color = 'red';
    document.getElementById('auth-message').innerText = "Password must be at least 8 characters.";
    return;
  }
  
  // Check if the user exists via PHP & MySQL.
  checkUserExists(email).then(exists => {
    if (!exists) {
      document.getElementById('auth-message').style.color = 'red';
      document.getElementById('auth-message').innerText = "User does not exist. Please sign up.";
    } else {
      document.getElementById('auth-message').style.color = 'green';
      document.getElementById('auth-message').innerText = "Sign in successful!";
      
      // Update profile header info. (Here we use the email as the default username.)
      document.querySelector('#profile-page .profile-username').innerText = email;
      
      // Update the profile container—assume the user-name is the <h2> inside .user-info.
      const userNameElem = document.querySelector('#profile-container .user-info h2');
      if (userNameElem) {
        userNameElem.innerText = email;
      }
      // Optionally, update additional info (like email) if your profile container contains it.
      
      // Hide the auth forms and show the profile container.
      showProfileContainer();
    }
  });
});

// ------------------------------------------
// Sign Up Handler
// ------------------------------------------
document.getElementById('signup-button').addEventListener('click', function(e) {
  e.preventDefault();
  
  // Note: In your HTML the username input has id "username".
  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;
  const passwordConfirm = document.getElementById('signup-password-confirm').value;
  
  if (!username) {
    document.getElementById('auth-message').style.color = 'red';
    document.getElementById('auth-message').innerText = "Please enter a username.";
    return;
  }
  if (!validateEmail(email)) {
    document.getElementById('auth-message').style.color = 'red';
    document.getElementById('auth-message').innerText = "Please enter a valid email.";
    return;
  }
  if (!isStrongPassword(password)) {
    document.getElementById('auth-message').style.color = 'red';
    document.getElementById('auth-message').innerText = "Password must be at least 8 characters with letters and numbers.";
    return;
  }
  if (password !== passwordConfirm) {
    document.getElementById('auth-message').style.color = 'red';
    document.getElementById('auth-message').innerText = "Passwords do not match.";
    return;
  }
  
  // Simulate registration process:
  // In a real implementation, you would send the data via POST to a PHP endpoint.
  // For this example, assume registration is successful.
  document.getElementById('auth-message').style.color = 'green';
  document.getElementById('auth-message').innerText = "Account created successfully!";
  
  // Update the profile header and container with the user's information.
  document.querySelector('#profile-page .profile-username').innerText = username;
  const userNameElem = document.querySelector('#profile-container .user-info h2');
  if (userNameElem) {
    userNameElem.innerText = username;
  }
  // Optionally, update additional info (such as email) into profile-container.
  
  // Hide the auth forms and show the profile container.
  showProfileContainer();
});
