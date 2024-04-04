from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware
import jwt
app = FastAPI(
	title = "MyTrello"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

fake_users = [
    {"id": 1, "role": "admin", "name": "Bob"},
    {"id": 2, "role": "investor", "name": "John"},
    {"id": 3, "role": "trader", "name": "Matt"},
]

class User(BaseModel):
	id: int
	role: str = "state"
	name: str = "bob"

@app.get("/users/{user_id}")
def get_hello(user_id: int) ->List[User]:
    return [user for user in fake_users if user.get("id") == user_id]

@app.get("/users")
def get_users() ->List[User]:
    return [user for user in fake_users]

@app.post("/users")
def get_hello(user: List[User]):
    fake_users.extend(user)
    print(fake_users)
    return {"status":200,"data":fake_users}




secret_key = "my_securyty_key"

token = jwt.encode(
    payload = user,
    key = key,
    algorithm = "HS256"
)

def get_token(user: User) ->str:
    token = jwt.encode(
        payload = user,
        key = "key",
        algorithm = "HS256"
    )
    return token

def get_dec_token(token: str) ->User:
    return jwt.decode(token,"key",algorithms=["HS256"])
