const selectedUsers = [];
let users = [];
let token = localStorage.getItem('accessToken')
let project_id = localStorage.getItem('id_project')
let project = {
    id:-1,
    name:'',
    description:'',
    short_description:'',
    start_date:'',
    date_update:'',
    deadline:'',
}

async function choeseUser(){

    const url = `/users/all/${token}`
    
    let answer = await request(url)
    for (let u of await answer) {
        users.push(u)
    }
    create_user_chose()
}

function create_user_chose() {
    const projectUsersDropdown = document.getElementById('project_users_dropdown');
    const selectedUsersContainer = document.getElementById('selectedUsers');
    users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = user.name;
        projectUsersDropdown.appendChild(option);
    });
}


function addUser(ev,role = 'support') {
    const projectUsersDropdown = document.getElementById('project_users_dropdown').value;
    const selectedUsersContainer = document.getElementById('selectedUsers');
    const selectedUser = users.find(u => u.id == parseInt(projectUsersDropdown));
    selectedUser.role = role

    if (!selectedUsers.includes(selectedUser)) {
        selectedUsers.push(selectedUser);

        const userDiv = document.createElement('div');
        userDiv.className = 'user';

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
        removeBtn.addEventListener('click', function() {
            const index = selectedUsers.indexOf(selectedUser);
            if (index > -1) {
                selectedUsers.splice(index, 1);
                selectedUsersContainer.removeChild(userDiv);
            }
        });
        userDiv.appendChild(removeBtn);

        selectedUsersContainer.appendChild(userDiv);
    }
}

async function createProject(){
    project.name = document.getElementById('project_name').value;
    project.short_description = document.getElementById('project_description').value;
    project.start_date = document.getElementById('create-date').value;
    project.date_update = document.getElementById('create-date').value
    project.deadline = document.getElementById('deadline').value

    let url = `/projects/${token}`
    project_id = await request(url,project)
    url = `/users_projects/${token}?project_id=${project_id}`
    await request(url,selectedUsers)

    window.location.href = 'main';

}

function closeCreate(argument) {
    window.location.href = 'main';
}

async function dellProject() {
    let url = `/project/dell/${token}?project_id=${project_id}`
    await request(url,[])
    window.location.href = 'main';
}

window.onload = async function(){
    document.getElementById('create-date').valueAsDate = new Date();
    document.getElementById('deadline').valueAsDate = new Date();
    document.getElementById('addUserBtn').addEventListener('click', addUser)
    await choeseUser()
    document.getElementById('createProjectBtn').addEventListener('click', createProject);
}