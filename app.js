// Task class
class Task {
	constructor(id, title, desc) {
		this.id = id;
		this.title = title;
		this.desc = desc;
	}
}

// UI class
class UI {
	static displayTasks() {
		const tasks = Store.getTasks();

		tasks.forEach((task) => UI.addTasksToList(task));
	}

	static addTasksToList(task) {
		const list = document.querySelector('#task-list');
		const row = document.createElement('tr');
		row.setAttribute("id", task.id);

		row.innerHTML = `
			<td>${task.title}</td>
			<td>${task.desc}</td>
			<td><a href="#" class="btn btn-danger btn-md delete fas fa-trash-alt"></a></td>
		`;

		list.appendChild(row);
	}

	static deleteTask(el) {
		if (el.classList.contains('delete')) {
			el.parentElement.parentElement.remove();
		}	
	}

	static showAlert(massage, className) {
		const div = document.createElement('div');
		div.className = `alert alert-${className}`;
		div.appendChild(document.createTextNode(massage));

		const container = document.querySelector('#todo-form-container');
		const form = document.querySelector('#todo-form');
		
		container.insertBefore(div, form);

		// Remove in 3 seconds
		setTimeout(() => document.querySelector('.alert').remove(), 3000);
	}

	static clearFileds() {
		document.querySelector('#title').value = '';
		document.querySelector('#desc').value = '';
	}
}

class Store {
	static getTasks() {
		let tasks;

		if (localStorage.getItem('tasks') === null) {
			tasks = [];
		} else {
			tasks = JSON.parse(localStorage.getItem('tasks'));
		}

		return tasks;
	}

	static addTask(task) {
		const tasks = Store.getTasks();
		
		tasks.push(task);

		localStorage.setItem('tasks', JSON.stringify(tasks));
	}

	static removeTask(id) {
		const tasks = Store.getTasks();

		tasks.forEach((task, index) => {
			if (task.id === id) {
				tasks.splice(index, 1);
			}
		});

		localStorage.setItem('tasks', JSON.stringify(tasks));
	}	
}

// Display Tasks
document.addEventListener('DOMContentLoaded', UI.displayTasks);

// Event: Add Tasks
document.querySelector('#todo-form').addEventListener('submit', (e) => {
	// Prevent actual submit
	e.preventDefault();

	// Get form values
	const title = document.querySelector('#title').value;
	const desc = document.querySelector('#desc').value;

	// Validations
	if (title === '' || desc === '') {
		UI.showAlert('Please fill all fileds', 'danger');
	} else {
		// Instatiate Tasks
		let id = Math.random().toString(36).substr(2, 9);
		const task = new Task(id, title, desc);

		// Add task to list
		UI.addTasksToList(task);

		// Add tasks to store
		Store.addTask(task);

		// Task added success massage
		UI.showAlert('Task added', 'success');

		// Clear fileds
		UI.clearFileds();
		}
});

// Event: Delete tasks
document.querySelector('#task-list').addEventListener('click', (e) => {
	// Remove tasks from UI
	UI.deleteTask(e.target);

	// Remove tasks from store
	Store.removeTask(e.target.parentElement.parentElement.getAttribute('id'));

	// Task added success massage
	UI.showAlert('Task deleted', 'info');
});