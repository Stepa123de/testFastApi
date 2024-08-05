from pydantic import BaseModel
from typing import List

class User(BaseModel):
    id: int = 0
    name: str = "No User"
    role: str = "support"

class FullUser(BaseModel):
    id: int = 0
    name: str = "No User"
    role: str = "support"
    password: str = "***"

class CreateUser(BaseModel):
    name: str = "name"
    password: str = "password"
    role: str = "support"
	
class UsersProjects(BaseModel):
    user_id: int = 0
    project_id: int = 0
    role: str = "support"

class Login(BaseModel):
    name: str
    password: str

class TaskModel(BaseModel):
    id: int
    name: str
    description: str
    state: int
    status: int
    user_id: int
    project_id: int

class Project(BaseModel):
    name: str
    description: str

class Links(BaseModel):
    project_id: int
    input_users: List[User]
    output_users: List[User]

class TaskState(BaseModel):
    task_id: int
    state: int

class ProjectContainer(BaseModel):
    id: int
    name: str
    short_description: str
    description: str
    start_date: str
    date_update: str
    deadline: str

def convert(model: BaseModel, value):
    element = {}
    for index,field in enumerate(model.__fields__):
        element[field] = value[index]
    return element
