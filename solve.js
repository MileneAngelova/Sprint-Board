function attachEvents() {

    let URL = 'http://localhost:3030/jsonstore/tasks/';

    let loadBtn = document.getElementById('load-board-btn');
    loadBtn.addEventListener("click", loadTasks);

    let addBtn = document.getElementById('create-task-btn');
    addBtn.addEventListener("click", addTask);

    let toDoField = document.getElementById('todo-section');
    let inProgressField = document.getElementById('in-progress-section');
    let codeField = document.getElementById('code-review-section');
    let doneField = document.getElementById('done-section');
    let titleInput = document.getElementById('title');
    let descriptionInput = document.getElementById('description');

    function loadTasks() {
        toDoField.children[1].textContent = '';
        inProgressField.children[1].textContent = '';
        codeField.children[1].textContent = '';
        doneField.children[1].textContent = '';

        fetch(URL)
            .then(info => info.json())
            .then(res => {
                let tasks = Object.values(res);
                let ul;

                for (let {title, description, status, _id} of tasks) {
                    let li = document.createElement('li');
                    li.className = 'task';

                    let h3 = document.createElement('h3');
                    h3.textContent = `${title}`;
                    li.appendChild(h3);

                    let p = document.createElement('p');
                    p.textContent = `${description}`;
                    li.appendChild(p);

                    let button = document.createElement('button');

                    if (status === 'ToDo') {
                        ul = toDoField.children[1];
                        button.textContent = 'Move to In Progress';

                    } else if (status === 'In Progress') {
                        ul = inProgressField.children[1];
                        button.textContent = 'Move to Code Review';

                    } else if (status === 'Code Review') {
                        ul = codeField.children[1];
                        button.textContent = 'Move to Done';

                    } else if (status === 'Done') {
                        ul = doneField.children[1];
                        button.textContent = 'Close';
                    }

                    if (status === 'Done') {
                        button.addEventListener("click", taskDone);
                    } else {
                        button.addEventListener("click", moveTask);
                    }

                    li.appendChild(button);
                    ul.appendChild(li);
                    function moveTask() {
                        let currentStatus = status;

                        if (currentStatus === 'ToDo') {
                            status = 'In Progress';
                        } else if (currentStatus === 'In Progress') {
                            status = 'Code Review';
                        } else if (currentStatus === 'Code Review') {
                            status = 'Done';
                        }

                        let headersPatch = {
                            method: 'PATCH',
                            body: JSON.stringify({status})
                        };

                        fetch(URL + _id, headersPatch)
                            .then(() => loadTasks())
                            .catch((err) => console.error(err));
                    }
                    function taskDone() {
                        let headersDelete = {
                            method: 'DELETE'
                        };

                        fetch(`${URL}${_id}`, headersDelete)
                            .then(() => loadTasks())
                            .catch(err => {
                                console.error(err);
                            })
                    }
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }

    function addTask() {
        let title = titleInput.value;
        let description = descriptionInput.value;
        let status = 'ToDo';

        let headers = {
            method: 'POST',
            body: JSON.stringify({title, description, status})
        }

        fetch(URL, headers)
            .then(() => {
                loadTasks();
                titleInput.value = '';
                descriptionInput.value = '';
            })
            .catch((error) => {
                console.error(error);
            })
    }
}

attachEvents();