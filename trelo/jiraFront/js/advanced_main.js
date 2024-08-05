
const token = localStorage.getItem('accessToken')
let openTask = null
let i_user
let projects
let users
let chouse_filter = {user : -1,project : -1}
let tasks = []

async function pre_validate() {
    project_pick = document.getElementById('project_pick')
    projects.forEach((project,index) => {
        const option = document.createElement('option');
        option.value = project.id;
        option.textContent = project.name;
        project_pick.appendChild(option);
    });

    user_pick = document.getElementById('user_pick')
    users.forEach((user,index) => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = user.name;
        user_pick.appendChild(option);
    });
}

async function update_tasks() {
    clean_tasks()
    if (chouse_filter.project == -1) {
        for (let project of projects) {
            answer = await request(`/tasks/${token}?project_id=${project.id}`)
            tasks = await tasks.concat(answer)
        }
    } else {
        tasks = await request(`/tasks/${token}?project_id=${chouse_filter.project}`)
    }
    if (chouse_filter.user != -1) {
        tasks = tasks.filter((task) => task.user_id == chouse_filter.user);
    }
    for (let task of tasks) {
        drow_task(task)
    }
}

function clean_tasks() {
    tasks=[]
    document.querySelectorAll('.item').forEach(e => e.remove());
    console.log(123)
}

function closeTaskMenu() {
    if (openTask != null) {
        openTask.target.innerHTML = openTask.body
        openTask = null
    }
}

function openTaskMenu(ev) {
    if (ev.target.tagName == 'SPAN') {
        target = ev.target.parentNode
    } else {
        target = ev.target
    }
    openTask = {target : target, body : ev.target.innerHTML, id : target.id}
    target.innerHTML = "";
    const task_id = target.id
    console.log(`${target} + ${task_id}`)
}

async function drow_task(task) {
    let user = (await request(`/users/${token}?user_id=${task.user_id}`)).name

	const newTask = document.createElement('div');
    newTask.className = 'item' + (i_user.id == task.user_id? ' ': ' not_my_item');
    newTask.draggable = true;
    newTask.textContent = task.name;
    newTask.onclick = openTaskMenu
    newTask.id = task.id;
    newTask.addEventListener('dragstart', drag);
	const witchUser = document.createElement('span');
	witchUser.textContent = user;
	witchUser.className = 'witch_user'
	newTask.appendChild(witchUser)
    const todoColumn = document.getElementById('state' + task.state);
    todoColumn.appendChild(newTask);
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function allowDrop(ev) {
    ev.preventDefault();
}

async function set_task_state(state,task_id) {
	const url = `/tasks/state/${token}`
	
	let answer = await request(url,{
		task_id: task_id,
		state: state
	},'PATCH')
}

function drop(ev) {

    ev.preventDefault();
    const task = ev.dataTransfer.getData("text")
    const state = ev.target.closest('.column').id.replace('state','')
    set_task_state(state,task)
    const draggedItem = document.getElementById(task);
    if (draggedItem.classList.contains('item')) {
        const column = ev.target.closest('.column');
        if (column) {
			if (column.childNodes.length == 3) {
				column.appendChild(draggedItem);
			}
			else {
				column.insertBefore(draggedItem, column.childNodes[3]);
			}
            
        }
    }
}

window.onload = async function(){
    i_user = await userVerification()
    projects = await request(`/projects/${token}`)
    users = await request(`/users/all/${token}`)

    if (localStorage.getItem('accessToken') == null) window.location.href = 'login';
    
    let task_filter = document.getElementById('task_filter')
    task_filter.addEventListener('change', async function handleChange(event) {
        if (event.target.id == 'project_pick') {
            chouse_filter.project = parseInt(event.target.value)
        } else if (event.target.id == 'user_pick') {
            chouse_filter.user = parseInt(event.target.value)
        }
        await update_tasks()
    });
    await pre_validate()
    await update_tasks()
}