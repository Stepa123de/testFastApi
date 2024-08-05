from fastapi import APIRouter
from fastapi import Response
from starlette.status import *
from typing import List
from jiraBack.analyzer.db.dbreader import dbreader
from jiraBack.analyzer.utils.mytypes import *
from jiraBack.analyzer.utils.create_token import get_token, get_dec_token

router = APIRouter()

@router.delete("/users/{token}")
def dell_user(token: str, user_id: int):
    """
    Удаление пользователя.
    """
    user = get_dec_token(token)
    if (user == None):
        response.status_code = HTTP_404_NOT_FOUND
    dbread = dbreader()

    if (user['role'] == 'admin' and user['id'] != user_id):
        dbread.dell_user(user_id)
    else:
        response.status_code = HTTP_406_NOT_ACCEPTABLE

@router.delete("/project/{token}")
def dell_project(token: str, project_id: int):
    """
    Удаление проекта.
    """
    user = get_dec_token(token)
    if (user == None):
        response.status_code = HTTP_404_NOT_FOUND
    dbread = dbreader()
    if (user['role'] == 'admin'):
        dbread.delete_project_by_id(project_id)
    else:
        response.status_code = HTTP_406_NOT_ACCEPTABLE

@router.delete("/tasks/{token}")
def dell_task(token: str, task_id: int,response: Response):
    """
    Удаление задачи.
    """
    user = get_dec_token(token)
    if (user == None):
        response.status_code = HTTP_404_NOT_FOUND
        return -1
    dbread = dbreader()
    project_id = dbread.get_task_by_id(task_id)[0][6]
    project_role = dbread.get_up_role_by_user_id(user['id'],project_id)
    if (user['role'] == 'admin' or project_role == 'admin'):
        return dbread.dell_task(task_id)
    return 1
