from fastapi import APIRouter
from fastapi import Response
from starlette.status import *
from typing import List
from jiraBack.analyzer.db.dbreader import dbreader
from jiraBack.analyzer.utils.mytypes import *
from jiraBack.analyzer.utils.create_token import get_token, get_dec_token

router = APIRouter()

@router.get("/project/{token}")
def set_task(token: str, project_id: int):
    user = get_dec_token(token)
    if (user == None):
        return {"status":404,"data": []}
    dbread = dbreader()
    projects = dbread.get_project_by_id(project_id)
    return [convert(ProjectContainer,project) for project in projects]

@router.get("/project/up/{token}")
def get_users_by_project_id(token: str, project_id: int,response: Response)->List[UsersProjects]:
    user = get_dec_token(token)
    if (user == None):
        response.status_code = HTTP_404_NOT_FOUND
        return [User()]
    dbread = dbreader()
    return [convert(UsersProjects,u) for u in dbread.get_up_project_by_id(project_id)]

@router.get("/projects/users/{token}")
def get_users_by_project_id(token: str, project_id: int,response: Response)->List[User]:
    user = get_dec_token(token)
    if (user == None):
        response.status_code = HTTP_404_NOT_FOUND
        return [User()]
    dbread = dbreader()
    return [convert(User,u) for u in dbread.get_all_users_by_project_id(project_id)]


@router.get("/users/{token}")
def get_hello(token: str, user_id: int, response: Response)-> User:
    user = get_dec_token(token)
    if (user == None):
        response.status_code = HTTP_404_NOT_FOUND
        return User()
    dbread = dbreader()
    if (user_id == -1):
        print(user['id'])
        if (dbread.get_user_by_id(user['id']) == []):
            return []
        else:
            return user
    elif (user_id == 0):
        return User()
    return convert(User,dbread.get_user_by_id(user_id)[0])

@router.get("/users/all/{token}")
def get_users(token: str)-> List[User]:
    dbread = dbreader()
    return [ convert(User,user) for user in dbread.get_users_protect()]

@router.get("/projects/{token}")
def get_projects(token: str, response: Response):
    user = get_dec_token(token)
    if (user == None):
        response.status_code = HTTP_404_NOT_FOUND
        return -1
    dbread = dbreader()
    answer =  dbread.get_user_project_by_id(str(user['id']))
    return [ convert(ProjectContainer,project) for project in answer]

@router.get("/tasks/{token}")
def get_task(token: str, project_id: int,response: Response):
    user = get_dec_token(token)
    if (user == None):
        response.status_code = HTTP_404_NOT_FOUND
        return []
    dbread = dbreader()
    return [ convert( TaskModel, task ) for task in dbread.get_project_tasks_by_id(project_id) ]