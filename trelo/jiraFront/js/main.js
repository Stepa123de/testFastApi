let token = localStorage.getItem('accessToken')
let projects = {
	names:[],
	state0:[],
	state1:[],
	state2:[],
	state3:[]
};

function create_project_element(root,id,name,description) {
	btn = document.createElement('Button')
	h2 = document.createElement('h2')
	p = document.createElement('p')
	btn.classList.add('btn')
	h2.innerHTML = name
	p.innerHTML = description
	btn.onclick = function() {
		localStorage.setItem('name_project',name)
		localStorage.setItem('id_project',id)
		window.location.href = 'projects_panel'
	}
	btn.appendChild(h2)
	btn.appendChild(p)
	root.appendChild(btn)
}

function create_button_add(container) {
	btn = document.createElement('Button')
	btn.classList.add('btn') 
	p = document.createElement('p')
	p.innerHTML = 'add'
	p.classList.add('btn_add')
	btn.onclick = function() {
		window.location.href = 'project';
	}
	btn.appendChild(p)
	container.appendChild(btn)
}



async function get_projects() {
	let answer = await request(`/projects/${token}`)


	container = document.getElementById('container')
	let index = 0;
	for (let project of answer) {
		projects.names.push(project.name)

		let answer = await request(`/tasks/${token}?project_id=${project.id}`)
		states = [0,0,0,0]
		for (task of answer) {
			states[task.state]++;
		}
		projects.state0.push(states[0])
		projects.state1.push(states[1])
		projects.state2.push(states[2])
		projects.state3.push(states[3])
		create_project_element(container,project.id,project.name,project.short_description)
	}
	create_button_add(container)
	new Chart('myMetric',{
		type: 'bar',
		data: {
			labels: projects.names,
			datasets: [
			  {
				label: 'Не начаты',
				data: projects.state0,
				backgroundColor: 'red',
			  },
			  {
				label: 'В работе',
				data: projects.state1,
				backgroundColor: 'green',
			  },
			  {
				label: 'Тестирование',
				data: projects.state2,
				backgroundColor: 'orange',
			  },
			  {
				label: 'Завершены',
				data: projects.state3,
				backgroundColor: 'grey',
			  },
			]
		}

	})
}

async function get_user(id = -1) {
	const url = `/users/${token}?user_id=${id}`
	
	let answer = await request(url)

	document.getElementById('header').innerHTML = answer.name//`Name: ${answer.name}, Role: ${answer.role}`
	
}

function openAddUserDialog() {
	const modal = document.getElementById('modal');
    modal.style.display = 'block';
}

function closeAddUserDialog() {
	const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

async function addUser(argument) {
	const url = `/users/${token}`
	
	await request(url,{
		name:document.getElementById('userName').value,
		password:document.getElementById('userPassword').value,
		role:document.getElementById('userRole').value,
	})

	closeAddUserDialog()
}

function exit() {
	localStorage.removeItem('accessToken');
	window.location.href = 'login';
}

function users_menu() {
	window.location.href = 'users';
}

window.onload = function(){
	localStorage.removeItem('id_project');
	if (localStorage.getItem('accessToken') == null) window.location.href = 'login';
	get_user()
	console.log(1231231)
	get_projects()
	document.getElementById('exit').onclick = exit;
	document.getElementById('users').onclick = users_menu;
	console.log(projects)
}