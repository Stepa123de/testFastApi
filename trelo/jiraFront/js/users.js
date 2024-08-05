let token = localStorage.getItem('accessToken')
let i_user 
let users = []
let on_change = new Set()
let users_table 

async function fillTable() {
    users = await request(`/users/all/${token}`)
    console.log(users)

    users_table.onchange = function(ev) {
        on_change.add(ev.target.parentNode.parentNode.id)
    };

    for (let user of users) {
        addTableLine(user)
    }
}

function back_to_menu() {
    console.log(123)
    window.location.href = 'main';
}

async function addTableLine(user) {
    let line = document.createElement('tr')
    let user_id = document.createElement('td')
    let user_name = document.createElement('td')
    let user_role = document.createElement('td')
    let user_password = document.createElement('td')
    let user_delete = document.createElement('td')
    let button_delete = document.createElement('button')

    if (i_user.role != 'admin') {
        document.getElementById('new-user').style.display = "none";
    }

    line.id = user.id
    user_id.innerText = user.id
    button_delete.innerHTML = 'X'
    button_delete.onclick = dell_user
    user_delete.appendChild(button_delete)

    if (i_user.role == 'admin' || i_user.id == user.id) {
        let input_name = document.createElement('input')
        let input_role = document.createElement('select')
        let admin = document.createElement('option')
        let support = document.createElement('option')
        let input_password = document.createElement('input')

        input_name.value = user.name
        admin.innerHTML = 'admin'
        admin.value = 1
        support.innerHTML = 'support'
        support.value = 2
        input_role.appendChild(admin)
        input_role.appendChild(support)
        input_role.value = (user.role == 'admin' ? 1 : 2)
        input_password.value = '***'

        user_name.appendChild(input_name)
        user_role.appendChild(input_role)
        user_password.appendChild(input_password)

    } else {
        user_name.innerText = user.name
        user_role.innerText = user.role
        user_password.innerText = '***'
    }
    

    line.appendChild(user_id)
    line.appendChild(user_name)
    line.appendChild(user_role)
    line.appendChild(user_password)
    line.appendChild(user_delete)

    users_table.appendChild(line)
}

async function dell_user(ev) {
    user_id = ev.target.parentNode.parentNode.id
    console.log(user_id)
    await request(`/users/${token}?user_id=${user_id}`,{},'DELETE')
}


async function save() {
    for (let id of on_change) {
        let childs = (document.getElementById(id)).childNodes
        let user = {
            id : parseInt(childs[0].innerHTML),
            name : childs[1].childNodes[0].value,
            role: childs[2].childNodes[0].value == 1 ? 'admin': 'support',
            password: childs[3].childNodes[0].value
        }
        console.log(user)
        await request(`/users/${token}`,user,'PATCH')
    }
}

async function add_user() {
    let user = {
        name : document.getElementById('name').value,
        role: document.getElementById('role').value == 1 ? 'admin': 'support',
        password: document.getElementById('password').value
    }
    await request(`/users/${token}`,user)
}

window.onload = async function(){
    i_user = await userVerification()
    fillTable()
    users_table = document.getElementById('users-table')
}

