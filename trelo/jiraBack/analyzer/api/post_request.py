from fastapi import APIRouter
from fastapi import Response
from starlette.status import *
from typing import List
from jiraBack.analyzer.db.dbreader import dbreader
from jiraBack.analyzer.utils.mytypes import *
from jiraBack.analyzer.utils.create_token import get_token, get_dec_token

router = APIRouter()

@router.post("/users/{token}")
def add_user(token: str, newUser: CreateUser,response: Response):
    user = get_dec_token(token)
    if (user == None):
        response.status_code = HTTP_404_NOT_FOUND
        return -1
    dbread = dbreader()
    if (user['role'] == 'admin'):
        dbread.set_user(newUser.name,newUser.password,newUser.role)
    else:
        response.status_code = HTTP_406_NOT_ACCEPTABLE
        return -1
    return 1    

@router.post("/tasks/{token}")
def set_task(token:str, task: TaskModel,response: Response):
    user = get_dec_token(token)
    if (user == None):
        response.status_code = HTTP_404_NOT_FOUND
        return -1
    dbread = dbreader()
    dbread.set_task(task.name,task.description,task.user_id,task.project_id)
    return 1

@router.post("/login")
def get_login(login: Login,response: Response):
    dbread = dbreader()
    answer = dbread.login_user(login)
    if answer == []:
        response.status_code = HTTP_405_METHOD_NOT_ALLOWED
        return -1
    user = convert(User,answer[0])
    return {"accessToken": get_token(user), "user":answer}

@router.post("/projects/{token}")
def set_project(token: str,project: ProjectContainer,response: Response)->int:
    user = get_dec_token(token)
    if (user == None):
        response.status_code = HTTP_404_NOT_FOUND
    dbread = dbreader()
    if (user['role'] == 'admin'):
        return dbread.set_project(project)
    else:
        response.status_code = HTTP_406_NOT_ACCEPTABLE

@router.post("/users_projects/{token}")
def set_dipens(token: str,project_id: int, users: List[User]):
    user = get_dec_token(token)
    if (user == None):
        response.status_code = HTTP_404_NOT_FOUND
    dbread = dbreader()
    print('\n\n\nNEW')
    if (user['role'] == 'admin'):
        for link in users:
            dbread.set_user_project_connection(link.id,project_id,link.role)
    else:
        response.status_code = HTTP_406_NOT_ACCEPTABLE
