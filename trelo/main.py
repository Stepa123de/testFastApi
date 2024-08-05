from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import sys

app = FastAPI(
	title = "MyTrello"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST","PATCH","DELETE"],
    allow_headers=["*"],
)

app.mount('/static',StaticFiles(directory = 'jiraFront'),name = 'static')

from jiraBack.analyzer.api import site,get,post,delete,patch 

app.include_router(site)
app.include_router(get)
app.include_router(post)
app.include_router(delete)
app.include_router(patch)