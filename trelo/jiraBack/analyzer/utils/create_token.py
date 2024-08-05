import jwt

from jiraBack.analyzer.utils.mytypes import *

def get_token(user: User) ->str:
    token = jwt.encode(
        payload = user,
        key = "key",
        algorithm = "HS256"
    )
    return token

def get_dec_token(token: str) -> User:
    try:
        token = jwt.decode(token,"key",algorithms=["HS256"])
        return token
    except:
        return None