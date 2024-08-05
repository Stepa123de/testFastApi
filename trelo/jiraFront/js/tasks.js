let task_data = new Array();
let task_on_change = new Array();
const token = localStorage.getItem('accessToken')
const project_id = localStorage.getItem('id_project')
let i_user

async function get_user() {
	answer = await request(`/users/${token}?user_id=${-1}`)

	document.getElementById('header').innerHTML = `TasksName: ${localStorage.getItem('name_project')} User: ${answer.name}, Role: ${answer.role}`
	
}
async function set_task(name,description,user_id,project_id) {
	console.log([name,description,user_id,project_id])
	await request('/tasks/'+token,{
		id : -1,
		name: name,
		description: description,
		state:-1,
		status:-1,
		user_id: user_id,
		project_id: project_id
	})
	location.reload()
}

async function get_all_users(project_id) {
	await select_update(token, project_id, 'choes_task_user');
	await select_update(token, project_id, 'choes_task_user_change');
}

async function set_task_state(state,task_id) {
	const url = `/tasks/state/${token}`
	
	let answer = await request(url,{
		task_id: task_id,
		state: state
	},'PATCH')
}

async function get_tasks() {
	const url = `/tasks/${token}?project_id=${project_id}`
	
	task_data = await request(url)
	for (task of task_data) {
		await createTask(task)
	}
}

async function updateTask(ev) {
	const url = `/tasks/${token}`

	task_on_change.name = document.getElementById('update_task_name').value,
	task_on_change.description = document.getElementById('update_task_description').value,
	task_on_change.user_id = document.getElementById('choes_task_user_change').value,

	await request(url, task_on_change,'PATCH')
	location.reload()
}

async function dell_task(ev) {
	const url = `/tasks/${token}?task_id=${task_on_change.id}`
	let answer = await request(url,[],'DELETE')
	location.reload()
}

function exit() {
	localStorage.removeItem('id_project');
	localStorage.removeItem('accessToken');
	window.location.href = 'login';
}

function menu() {
	localStorage.removeItem('id_project');
	window.location.href = 'main';
}

function back() {
	window.location.href = 'projects_panel';
}


function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
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

function openModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'block';
}

function openTaskMenu(ev) {
	let id = ev.target.draggable == true ? ev.target.id: ev.target.parentNode.id
	
	task_on_change = task_data.find(item => item.id == id)
	const modal = document.getElementById('task_menu');
	document.getElementById('update_task_name').value = task_on_change.name
    document.getElementById('update_task_description').value = task_on_change.description
    document.getElementById('choes_task_user_change').value = task_on_change.user_id
    modal.style.display = 'block';
}

function closeTaskMenu(ev) {
	const modal = document.getElementById('task_menu');
    modal.style.display = 'none';
}

async function createTask(task) {
	let user = (await request(`/users/${token}?user_id=${task.user_id}`)).name
	
	const newTask = document.createElement('div');
	console.log(i_user[0])
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
	console.log(task)
}

function addTask() {
    const taskNameInput = document.getElementById('taskName').value;
    const taskDescriptionInput = document.getElementById('taskDescription').value;
    const select = document.getElementById('choes_task_user').value;
    set_task(taskNameInput,taskDescriptionInput,select,project_id)
    
    closeAddTaskModal();  
}

function closeAddTaskModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}


window.onload = async function(){
	i_user = await userVerification()
	if (localStorage.getItem('accessToken') == null) window.location.href = 'login';
	if (localStorage.getItem('name_project') == null) window.location.href = 'main';
	get_user()
	document.getElementById('exit').onclick = exit;
	document.getElementById('back').onclick = back;
	document.getElementById('menu').onclick = menu;
	document.getElementById('add').onclick = openModal;
	get_tasks()
	get_all_users(project_id)
}