const PATCH = 'PATCH'
const POST = 'POST'
const GET = 'GET'

async function request(link,data = null,type = 'POST') {
    let response
    if (data == null) {
        response = await fetch(link , {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
        })
    } else {
        response = await fetch(link , {
            method: type,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
    }
    if (response.ok) {
        return response.json()
    } else {
        switch (response.status) {
          case 404:
            alert( '404 токен устарел' );
            break;
          case 406:
            alert( '406 у тебя нет прав' );
            break;
          default:
            alert(response.status)
        }
    }
}

async function select_update(token, project_id, element) {
    let url = `/projects/users/${token}?project_id=${project_id}`

    let answer = await request(url)

    const select = document.getElementById(element);
    for (let user of answer) {
        let option = document.createElement('option');
        option.value = user.id;
        option.textContent = user.name;
        select.appendChild(option);

    }
}

async function createDialog(name, root, object, funcOnAcept) {
    container = document.getElementById(rooot)
    for (let prop in object) {
        console.log(`${prop} - ${jsonObj(prop)}`)
    }
}

/**
 Проверяет есть ли пользователь в базе
 При наличии такового возвращает информацию о пользователе
 Иначе удаляет токен и выкидывае на login
*/
async function userVerification()
{
    let token = localStorage.getItem('accessToken')
    i_user = await request(`/users/${token}?user_id=${-1}`)
    console.log(i_user)
    if (i_user == undefined) {
        window.location.href = 'login';
    }
    return i_user
}