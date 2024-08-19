document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const taskDueDate = document.getElementById('task-due-date');
    const taskPriority = document.getElementById('task-priority');
    const addTaskBtn = document.getElementById('add-task-btn');
    const pendingTasksList = document.getElementById('pending-tasks-list');
    const completedTasksList = document.getElementById('completed-tasks-list');
    const searchInput = document.getElementById('search-input');
    const darkModeToggle = document.getElementById('dark-mode-toggle');

    // Load tasks from local storage
    loadTasks();

    addTaskBtn.addEventListener('click', addTask);
    searchInput.addEventListener('input', filterTasks);
    darkModeToggle.addEventListener('change', toggleDarkMode);

    function addTask() {
        const taskText = taskInput.value.trim();
        const dueDate = taskDueDate.value;
        const priority = taskPriority.value;

        if (taskText !== '') {
            const taskItem = createTaskItem(taskText, dueDate, priority);
            pendingTasksList.appendChild(taskItem);
            saveTasks();
            clearInputs();
        }
    }

    function createTaskItem(taskText, dueDate, priority) {
        const li = document.createElement('li');
        li.className = `priority-${priority}`;
        li.innerHTML = `${taskText} (Due: ${dueDate})`;

        const completeBtn = document.createElement('button');
        completeBtn.textContent = 'Complete';
        completeBtn.className = 'complete-btn';
        completeBtn.addEventListener('click', () => completeTask(li));

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.className = 'edit-btn';
        editBtn.addEventListener('click', () => editTask(li));

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', () => deleteTask(li));

        li.appendChild(completeBtn);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);

        return li;
    }

    function completeTask(taskItem) {
        taskItem.querySelector('.complete-btn').remove();
        completedTasksList.appendChild(taskItem);
        saveTasks();
    }

    function editTask(taskItem) {
        const newTaskText = prompt('Edit your task:', taskItem.firstChild.textContent);
        const newDueDate = prompt('Edit due date:', taskItem.textContent.match(/\(Due: (.*?)\)/)[1]);
        const newPriority = prompt('Edit priority:', taskItem.className.split('-')[1]);

        if (newTaskText !== null) {
            taskItem.firstChild.textContent = newTaskText;
        }

        if (newDueDate !== null) {
            taskItem.innerHTML = `${newTaskText} (Due: ${newDueDate})`;
        }

        if (newPriority !== null) {
            taskItem.className = `priority-${newPriority}`;
        }

        saveTasks();
    }

    function deleteTask(taskItem) {
        taskItem.remove();
        saveTasks();
    }

    function filterTasks() {
        const searchTerm = searchInput.value.toLowerCase();
        const tasks = document.querySelectorAll('li');

        tasks.forEach(task => {
            const taskText = task.textContent.toLowerCase();
            if (taskText.includes(searchTerm)) {
                task.style.display = '';
            } else {
                task.style.display = 'none';
            }
        });
    }

    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode', darkModeToggle.checked);
        document.querySelector('.container').classList.toggle('dark-mode', darkModeToggle.checked);
        saveDarkMode();
    }

    function saveTasks() {
        const tasks = [];
        document.querySelectorAll('ul > li').forEach(task => {
            tasks.push({
                text: task.firstChild.textContent,
                dueDate: task.textContent.match(/\(Due: (.*?)\)/)[1],
                priority: task.className.split('-')[1],
                completed: task.parentElement.id === 'completed-tasks-list'
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            const taskItem = createTaskItem(task.text, task.dueDate, task.priority);
            if (task.completed) {
                completedTasksList.appendChild(taskItem);
            } else {
                pendingTasksList.appendChild(taskItem);
            }
        });
        darkModeToggle.checked = localStorage.getItem('darkMode') === 'true';
        toggleDarkMode();
    }

    function saveDarkMode() {
        localStorage.setItem('darkMode', darkModeToggle.checked);
    }

    function clearInputs() {
        taskInput.value = '';
        taskDueDate.value = '';
        taskPriority.value = 'low';
    }
});
