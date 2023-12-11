document.addEventListener('DOMContentLoaded', () => {
    let tasks = loadTasksFromLocalStorage();

    // Supprimer toutes les tâches cochées
    const deleteCompletedTasksButton = createDeleteButton();
    document.body.appendChild(deleteCompletedTasksButton);

    // Afficher toutes les tâches au chargement de la page
    updateTaskList(tasks);

    // Ajouter une nouvelle tâche à partir du formulaire
    const addTaskForm = document.querySelector('form');
    if (addTaskForm) {
        addTaskForm.addEventListener('submit', (event) => {
            event.preventDefault();
            addTask(tasks);
            saveTasksToLocalStorage(tasks);
        });
    }

    function createDeleteButton() {
        const button = document.createElement('button');
        button.textContent = 'Supprimer les tâches terminées';
        button.id = 'deleteCompletedTasks';
        button.addEventListener('click', () => {
            deleteCompletedTasks(tasks);
            saveTasksToLocalStorage(tasks);
        });
        return button;
    }
});

const updateTaskList = (tasks) => {
    const taskList = document.querySelector('ul');
    if (taskList) {
        taskList.innerHTML = '';

        tasks.forEach((task) => {
            const listItem = document.createElement('li');
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(task.title));
            listItem.appendChild(label);

            if (task.priority === 1) {
                listItem.style.color = 'red';
            } else if (task.priority === 2) {
                listItem.style.color = 'blue';
            } else if (task.priority === 3) {
                listItem.style.color = 'green';
            }

            checkbox.checked = task.completed;
            if (task.completed) {
                label.style.textDecoration = 'line-through';
            }

            checkbox.addEventListener('change', () => {
                toggleTaskCompletion(checkbox, listItem, task);
                saveTasksToLocalStorage(tasks);
            });

            taskList.appendChild(listItem);
        });
    }
};

const addTask = (tasks) => {
    const titleInput = document.getElementById('title');
    const prioritySelect = document.getElementById('priority');

    if (titleInput && prioritySelect) {
        const title = titleInput.value.trim(); // Trim to remove leading/trailing spaces

        if (title === '') {
            alert('Please enter a title for the task.');
            return; // Stop execution if the title is empty
        }

        const newTask = {
            title: title,
            priority: parseInt(prioritySelect.value),
            completed: false
        };

        tasks.push(newTask);
        updateTaskList(tasks);

        titleInput.value = '';
        prioritySelect.value = '1';
    }
};

const toggleTaskCompletion = (checkbox, listItem, task) => {
    task.completed = checkbox.checked;

    if (task.completed) {
        listItem.style.textDecoration = 'line-through';
    } else {
        listItem.style.textDecoration = 'none';
    }
};

const deleteCompletedTasks = (tasks) => {
    const completedTasks = tasks.filter((task) => task.completed);
    const remainingTasks = tasks.filter((task) => !task.completed);

    tasks.length = 0; // Clear the tasks array
    tasks.push(...remainingTasks);
    updateTaskList(tasks);

    // Send an alert to the user
    alert(`${completedTasks.length} completed tasks deleted.`);
};

const loadTasksFromLocalStorage = () => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    return storedTasks;
};

const saveTasksToLocalStorage = (tasks) => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};
