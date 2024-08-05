# JS
## Запросы
```js
asyncfunctionrequest(link,data=null) {
    url='http://127.0.0.1:8000'+link
    letresponse
    if (data==null) {
        response=awaitfetch(url , {
            method:"GET",
            headers: {
                'Content-Type':'application/json'
            },
        })
    } else {
        response=awaitfetch(url , {
            method:"POST",
            headers: {
                'Content-Type':'application/json'
            },
            body:JSON.stringify(data)
        })
    }
    if (response.ok) {
        returnresponse.json()
    } else {
        switch (response.status) {
          case 404:
            alert( '404 токен устарел' );
            break;
          case 405:
            alert( 'no user with this name and password' );
            break;
          case 406:
            alert( '406 у тебя нет прав' );
            break;
          default:
            alert(response.status);
        }
    }
}
```
#### Ошибка 404 вызывается когда токен не поддается расшифровки
#### Ошибка 405 вызывается при неправильном вводе пароля
#### Ошибка 406 вызывается при не совпадении прав (создание проекта не админом, создание задачи не админом или не локальным админом)
### Пример запроса
```js
let url = `/users/${token}`
answer = await request(url) // get request
answer = await request(url,{
    id: "0"
    name: "name",
    role: "role"
}) // post request
answer = await request(url,[]) // post with empty body
```