document.addEventListener('DOMContentLoaded', (event) => {
    const todayTasksList = document.getElementById('today-tasks-list');
    const upcomingTasksList = document.getElementById('upcoming-tasks-list');
    const newTaskForm = document.getElementById('new-task-form');
    const completedTasksList = document.getElementById('completed-tasks-list');
    if (completedTasksList) {
        loadCompletedTasks();
        const clearCompletedBtn = document.getElementById('clear-completed');
        if (clearCompletedBtn) {
            clearCompletedBtn.addEventListener('click', clearCompletedTasks);
        }
    }

    // Helper function to format dates as MM-DD-YYYY
    function formatDate(d) {
        const date = new Date(d);
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset()); // Adjust for timezone offset
        const day = ('0' + date.getDate()).slice(-2);
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const year = date.getFullYear();
        return `${month}-${day}-${year}`;
    }

    // Helper function to check if a date is today's date
    function isToday(date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Remove time component
        date.setHours(0, 0, 0, 0);
        return date.getTime() === today.getTime();
    }

    // Function to mark a task as done
    function markTaskAsDone(taskId) {
        fetch(`/done-task/${taskId}`, { method: 'POST' })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'OK') {
                listTasks(); // Refresh the tasks list
            } else {
                throw new Error('Failed to mark task as done');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    // Functionality for listing tasks
    function listTasks() {
        todayTasksList.innerHTML = '';
        upcomingTasksList.innerHTML = '';

        fetch('/get-tasks') // Fetch tasks from the server
            .then(response => response.json())
            .then(tasks => {
                let hasTodayTasks = false;
                let hasUpcomingTasks = false;

                tasks.forEach(task => {
                    const taskDate = new Date(task.due_date);
                    taskDate.setMinutes(taskDate.getMinutes() + taskDate.getTimezoneOffset()); // Adjust for timezone offset
                    const listItem = document.createElement('li');
                    listItem.textContent = `[${task.category}] ${task.description} (${task.priority}) `;

                    // Append a 'Done' button to each task
                    const doneButton = document.createElement('button');
                    doneButton.innerText = 'Done';
                    doneButton.onclick = () => markTaskAsDone(task.id);

                    // Determine if the task is for today or upcoming and append it to the correct list
                    if (isToday(taskDate)) {
                        hasTodayTasks = true;
                        listItem.appendChild(doneButton);
                        todayTasksList.appendChild(listItem);
                    } else if (taskDate > new Date()) {
                        hasUpcomingTasks = true;
                        listItem.textContent = `${formatDate(task.due_date)} — ${listItem.textContent}`;
                        listItem.appendChild(doneButton);
                        upcomingTasksList.appendChild(listItem);
                    }
                });

                // If there are no tasks for today, display a message
                if (!hasTodayTasks) {
                    todayTasksList.innerHTML = '<li>Woo, no tasks today!</li>';
                }

                // If there are no upcoming tasks, display a message
                if (!hasUpcomingTasks) {
                    upcomingTasksList.innerHTML = '<li>Woo, clear horizons ahead!</li>';
                }
            })
            .catch(error => console.error('Error fetching tasks:', error));
    }

    // Functionality for adding a task via the new task form
    newTaskForm.onsubmit = function(event) {
        event.preventDefault();

        const formData = new FormData(newTaskForm);
        const due_date = new Date(formData.get('due_date') + 'T12:00:00'); // Set time to noon to avoid timezone issues

        const taskData = {
            description: formData.get('description'),
            category: formData.get('category'),
            priority: formData.get('priority'),
            due_date: due_date.toISOString().split('T')[0] // Convert to YYYY-MM-DD format
        };

        fetch('/add-task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'OK') {
                    listTasks(); // Refresh the tasks list
                } else {
                    throw new Error('Task addition failed');
                }
            })
            .catch(error => console.error('Error:', error));
    };

    function clearCompletedTasks() {
        fetch('/clear-completed-tasks', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            // Add any additional headers or information necessary for authentication, if applicable
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'OK') {
                loadCompletedTasks(); // Refresh the tasks list to show it's empty
            } else {
                throw new Error('Failed to clear completed tasks');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    // Function to fetch and display completed tasks
    function loadCompletedTasks() {
    fetch('/api/completed-tasks') // Endpoint to get completed tasks
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(tasks => {
            if (tasks.length === 0) {
                completedTasksList.innerHTML = '<li>No completed tasks :( Get to hustling!</li>';
            } else {
                tasks.forEach(task => {
                    const listItem = document.createElement('li');
                    listItem.textContent = `[${task.category}] ${task.description} - Completed on: ${task.completed_date}`;
                    completedTasksList.appendChild(listItem);
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    // Log out button functionality
    const logoutButton = document.getElementById('logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            fetch('/logout', { method: 'POST' })
                .then(response => {
                    if (response.ok) {
                        window.location.href = '/';
                    } else {
                        throw new Error('Logout failed');
                    }
                })
                .catch(error => console.error('Error:', error));
        });
    }

    // Initial call to list all tasks
    listTasks();
});

document.getElementById('view-completed').addEventListener('click', () => {
    window.location.href = '/completed';
});
