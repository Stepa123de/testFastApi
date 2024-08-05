async function req_login(name,password) {
	const url = "/login"
	let answer = await request(url,{
		name : name,
		password: password
	})
	localStorage.setItem('accessToken', answer.accessToken);
	localStorage.setItem('userInfo', answer.user);
	window.location.href = 'main';
}

function login_button_onclick() {
		login = document.getElementById('login').value
		password = document.getElementById('password').value
		if (login == '' || password == '') {
			return 0
		}
		req_login(login,password)
		document.getElementById('login').value = ""
		document.getElementById('password').value = ""
	}

window.onload = function(){
	if (localStorage.getItem('accessToken') != null) window.location.href = 'main';
    document.addEventListener('keydown', keyboard);
	document.getElementById('login_button').onclick = login_button_onclick;
	console.log("load")
}

function keyboard(event) {
    
    switch (event.code) {
        case 'Enter':
            login_button_onclick()
            break;
    
        default:
            //console.log(event.code)
            break;
    }
}