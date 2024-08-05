from fastapi import APIRouter
from fastapi import Response
from starlette.status import *
from typing import List
from jiraBack.analyzer.db.dbreader import dbreader
from jiraBack.analyzer.utils.mytypes import *
from jiraBack.analyzer.utils.create_token import get_token, get_dec_token

router = APIRouter()

@router.patch("/users/{token}")
def update_user(token: str,updateUser: FullUser,response: Response):
    user = get_dec_token(token)
    if (user == None):
        response.status_code = HTTP_404_NOT_FOUND
    dbread = dbreader()
    if (user['role'] == 'admin'):
        return dbread.update_user(updateUser)
    else:
        if (updateUser.id == user['id']):
            return dbread.update_user_protect(updateUser)
        else:
            response.status_code = HTTP_406_NOT_ACCEPTABLE

@router.patch("/projects/{token}")
def set_project(token: str,project: ProjectContainer,response: Response):
    user = get_dec_token(token)
    if (user == None):
        response.status_code = HTTP_404_NOT_FOUND
    dbread = dbreader()
    if (user['role'] == 'admin'):
        return dbread.update_project(project)
    else:
        response.status_code = HTTP_406_NOT_ACCEPTABLE

@router.patch("/tasks/state/{token}")
def update_task_state(token: str, state: TaskState,response: Response):
    user = get_dec_token(token)
    if (user == None):
        response.status_code = HTTP_404_NOT_FOUND
        return -1
    dbread = dbreader()
    dbread.set_task_state_by_id(state.state,state.task_id)
    return 1

@router.patch("/tasks/{token}")
def update_task_by_id(token:str,task: TaskModel,response: Response):
    user = get_dec_token(token)
    if (user == None):
        response.status_code = HTTP_404_NOT_FOUND
        return -1
    dbread = dbreader()
    project_id = dbread.get_task_by_id(task.id)[0][6]
    if (user['role'] == 'admin' or dbread.get_up_role_by_user_id(user['id'],project_id) == 'admin'):
        print(task)
        dbread.update_task_by_id(task.id,task.name,task.description,task.user_id,task.project_id)
    else:
        response.status_code = HTTP_406_NOT_ACCEPTABLE
        return -1
    return 1

@router.patch("/users_projects/{token}")
def full_update(token: str, links: Links,response: Response):
    user = get_dec_token(token)
    if (user == None):
        response.status_code = HTTP_404_NOT_FOUND
    dbread = dbreader()
    if (user['role'] == 'admin'):
        dbread.dell_up(links.project_id)
        for link in links.input_users:
            dbread.set_user_project_connection(link.id,links.project_id,link.role)
    else:
        response.status_code = HTTP_406_NOT_ACCEPTABLE  