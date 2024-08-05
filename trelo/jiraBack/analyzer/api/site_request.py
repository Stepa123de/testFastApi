from fastapi import APIRouter
from fastapi.responses import FileResponse

router = APIRouter()

url = 'jiraFront/'

def page(this):
    return FileResponse(url + 'html/' + this + '.html')

#http запросы
@router.get('/', response_class=FileResponse)
async def read_index():
    return page('login')

@router.get('/login', response_class=FileResponse)
async def read_index():
    return page('login')

@router.get('/users', response_class=FileResponse)
async def read_index():
    return page('users')

@router.get('/main', response_class=FileResponse)
async def read_index():
    return page('main')

@router.get('/advanced_main', response_class=FileResponse)
async def read_index():
    return page('advanced_main')

@router.get('/project', response_class=FileResponse)
async def read_index():
    return page('project')

@router.get('/projects_panel', response_class=FileResponse)
async def read_index():
    return page('projects_panel')

@router.get('/tasks', response_class=FileResponse)
async def read_index():
    return page('tasks')