import sqlite3
from schema import *

connection = sqlite3.connect('my_database.db')
cursor = connection.cursor()

cursor.execute(tabel_projects)
cursor.execute(tabel_users)
cursor.execute(tabel_users_projects)
cursor.execute(tabel_tasks)
cursor.execute(triger_projects_update)
cursor.execute(triger_tasks_update)

connection.commit()
connection.close()
