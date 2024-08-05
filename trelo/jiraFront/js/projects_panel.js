let token = localStorage.getItem('accessToken')
let project_id = localStorage.getItem('id_project')
let users = []
let selectedUsers = []
let tasks
let task_on_change
let project

async function project_init() {
	let url = `/project/${token}?project_id=${project_id}`
    project = (await request(url))[0]
    document.getElementById('project-name').textContent = project.name
    document.getElementById('short-description').textContent = project.short_description
    document.getElementById('description').textContent = project.description
    document.getElementById('date-create').value  = project.start_date
    document.getElementById('date-update').value  = project.date_update
    document.getElementById('date-dead').value  = project.deadline
}

async function users_init() {
    let url = `/project/up/${token}?project_id=${project_id}`
    let answer = await request(url)
    for (u of answer) {
    	add_user(u.user_id,u.role)
    }
}

async function tasks_init() {
	const url = `/tasks/${token}?project_id=${project_id}`
	tasks = await request(url)
	let states = [0,0,0,0]
	tasks.forEach((task,index) => {
		add_task(task,index)
		states[task.state]++
	})
	document.getElementById('task_stats').innerHTML = `Не начато: ${states[0]}\nВ работе: ${states[1]}\nТестирование: ${states[2]}\nЗавершена: ${states[3]}`
    console.log(tasks)
}

function select_add(user,index) {
	const option = document.createElement('option');
    option.value = index;
    option.textContent = user.name;
    document.getElementById('user-select').appendChild(option);
}

function add_user_from_select() {
	const index = parseInt(document.getElementById('user-select').value)
	add_user(users[index].id,users[index].role)
}

function add_task(task,index) {
	const task_button = document.createElement('button')
	task_button.className = 'task_button'
	task_button.id = index
	task_button.innerHTML = task.name + ' : ' + task.description
	task_button.addEventListener('click',openTaskMenu)
	document.getElementById('task-container').appendChild(task_button)
}

async function openTaskMenu(ev) {
	let task_id = ev.target.id
	task_on_change = tasks[task_id]
	const modal = document.getElementById('modal');
	document.getElementById('taskName').value = task_on_change.name
    document.getElementById('taskDescription').value = task_on_change.description
    document.getElementById('choes_task_user').value = task_on_change.user_id
    modal.style.display = 'block';
}

function closeTaskMenu(ev) {
	const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

async function saveTask(ev) {
    const url = `/tasks/${token}?task_id=${task_on_change.id}`

    task_on_change.name = document.getElementById('taskName').value
    task_on_change.description = document.getElementById('taskDescription').value
    task_on_change.user_id = document.getElementById('choes_task_user').value

	let answer = await request(url, task_on_change,'PATCH')
	location.reload()
}


async function deleteTask() {
    const url = `/tasks/${token}?task_id=${task_on_change.id}`
	await request(url,[],'DELETE')
    location.reload()
}

function add_user(user_id,role) {
	selectedUser = users.find(u => u.id == user_id);
	selectedUsersContainer = document.getElementById('users-container')
	selectedUser.role = role

	if (!selectedUsers.includes(selectedUser)) {
        selectedUsers.push(selectedUser);

        const userDiv = document.createElement('div');
        userDiv.className = 'user';
        userDiv.id = selectedUsers.length - 1

        const userInfoSpan = document.createElement('span');
        userInfoSpan.textContent = selectedUser.name;
        userDiv.appendChild(userInfoSpan);

        const adminBtn = document.createElement('button');
        adminBtn.textContent = role;
        adminBtn.addEventListener('click', function(ev) {
            ev.preventDefault();
            if (ev.target.textContent == 'admin') {
                ev.target.textContent = 'support'
                selectedUser.role = 'support';
            } else {
                ev.target.textContent = 'admin'
                selectedUser.role = 'admin';
            }
            
        });
        userDiv.appendChild(adminBtn);

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'delete';
        removeBtn.addEventListener('click', function(ev) {
            let parant = ev.target.parentElement
            selectedUsers.splice(parant.id, 1);
            selectedUsersContainer.removeChild(parant)
        });
        userDiv.appendChild(removeBtn);

        selectedUsersContainer.appendChild(userDiv);
    }
}

async function save() {
	project.name = document.getElementById('project-name').textContent
    project.short_description = document.getElementById('short-description').value
    project.description = document.getElementById('description').value
    project.start_date = document.getElementById('date-create').value
    project.date_update = document.getElementById('date-update').value
    project.deadline = document.getElementById('date-dead').value
    await request(`/projects/${token}`,project,'PATCH')
    let output_users = users.filter(x => !selectedUsers.includes(x));
    data = {
        project_id: project_id,
        input_users: selectedUsers,
        output_users: output_users
    }
    url = `/users_projects/${token}`
    await request(url,data,'PATCH');
    location.reload()
}

function back() {
	localStorage.removeItem('id_project')
	window.location.href = 'main';
}

function to_tasks() {
	window.location.href = 'tasks';
}

async function delait_project() {
	let url = `/project/${token}?project_id=${project_id}`
    await request(url,[],'DELETE')
    window.location.href = 'main';
}

window.onload = async function(){
	if (localStorage.getItem('accessToken') == null) window.location.href = 'login';
	users = await request(`/users/all/${token}`)
	users.forEach((user,index) => select_add(user,index))
    await select_update(token, project_id, 'choes_task_user')
    project_init()
    users_init()
    tasks_init()
}