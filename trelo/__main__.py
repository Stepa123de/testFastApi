import os

file = os.path.abspath('main.py')[:-3]
os.system("uvicorn main:app --host 172.20.100.22 --reload")