import sqlite3
import sys

from jiraBack.analyzer.utils.mytypes import *

class dbreader:
    def _connect(self):
        self.con = sqlite3.connect(self.filepath)
        self.cur = self.con.cursor()
    def _disconnect(self):
        self.con.close()
    def __del__(self):
        self._disconnect()
    def __init__(self):
        self.filepath = 'jiraBack/analyzer/files_db/my_database.db'
        self._connect()
    # login/register
    def register_user(self,name: str, password: str):
        pass
    def login_user(self,login: Login) -> User:
        self.cur.execute("SELECT id,name,role FROM users WHERE name = ? AND password = ?",(login.name, login.password))
        return self.cur.fetchall()

    # user
    def set_user(self,name: str, password: str,role: str = "support"):
        self.cur.execute(f"SELECT * FROM users WHERE name = '{name}';")
        users = self.cur.fetchall()
        if (users != []):
            return ""
        self.cur.execute(f"INSERT INTO users (name,password,role) VALUES ('{name}','{password}','{role}') RETURNING ID;")
        user_id = self.cur.fetchall()
        self.con.commit()
        if (role == "admin"):
            self.cur.execute("SELECT id FROM projects")
            projects = self.cur.fetchall()
            for project_id in projects:
                self.set_user_project_connection(user_id[0][0],project_id[0])
        self.con.commit()
    def update_user(self,user: FullUser) -> str:
        if user.password == '***':
            self.cur.execute("UPDATE users SET name = ?,role = ?WHERE id = ?",(user.name,user.role,user.id))
        else:
            self.cur.execute("UPDATE users SET name = ?,role = ?,password = ? WHERE id = ?",(user.name,user.role,user.password,user.id))
        self.con.commit()
    def update_user_protect(self,user: FullUser) -> str:
        if user.password == '***':
            self.cur.execute("UPDATE users SET name = ?WHERE id = ?",(user.name,user.id))
        else:
            self.cur.execute("UPDATE users SET name = ?,password = ? WHERE id = ?",(user.name,user.password,user.id))
        self.con.commit()

    def get_user_by_id(self,id) -> str:
        self.cur.execute("SELECT id,name,role FROM users WHERE id = ?",(str(id),))
        return self.cur.fetchall()
    def get_user_protect_by_id(self,id) -> str:
        self.cur.execute("SELECT id,name,role FROM users WHERE id = ?",(str(id),))
        return self.cur.fetchall()
    def get_users_protect(self) -> str:
        self.cur.execute("SELECT id,name,role FROM users")
        return self.cur.fetchall()
    def get_users(self) -> str:
        self.cur.execute("SELECT * FROM users")
        return self.cur.fetchall()
    def get_all_users_by_project_id(self,project_id: int):
        self.cur.execute("""SELECT u.id,u.name,u.role FROM users u 
        INNER JOIN users_projects up ON up.user_id = u.id
        WHERE up.project_id = ?""",(str(project_id),))
        return self.cur.fetchall()
    def dell_user(self,user_id : int):
        self.cur.execute(f"DELETE FROM users WHERE id = {user_id}")
        self.cur.execute(f"UPDATE tasks SET user_id = 0 WHERE user_id = {user_id}")
        self.cur.execute(f"DELETE FROM users_projects WHERE user_id = {user_id}")
        self.con.commit()
    #users_projects
    def dell_up(self,project_id: int):
        self.cur.execute("DELETE FROM users_projects WHERE project_id = ?",(str(project_id),))
        for user in self.get_users():
            if user[2] == 'admin':
                self.set_user_project_connection(user[0],project_id,'support')
        self.con.commit()
    def get_up_role_by_user_id(self, user_id: int, project_id: int):
        self.cur.execute("SELECT role FROM users_projects WHERE user_id = ? AND project_id = ?",(str(user_id),str(project_id)))
        ans = self.cur.fetchall()
        if (ans != []):
            ans = ans[0][0]
        return ans
    def set_user_project_connection(self,user_id: int,project_id: int, role: str = "support"):
        if (self.get_up_role_by_user_id(user_id,project_id) == []):
            self.cur.execute("""INSERT INTO users_projects (user_id,project_id,role) VALUES (?,?,?)""",(str(user_id), str(project_id), str(role)))
        else:
            self.cur.execute("UPDATE users_projects SET role = ? WHERE user_id = ? AND project_id = ?",(str(role),str(user_id),str(project_id)))
        self.con.commit()
    # project
    def get_user_project_by_id(self,id: int) -> str:
        self.cur.execute("""SELECT * FROM projects JOIN 
        users_projects ON projects.id = users_projects.project_id 
        JOIN users ON users.id = users_projects.user_id 
        WHERE users.id = ?""",(str(id),))
        return self.cur.fetchall()
    def get_up_project_by_id(self,project_id: int) -> str:
        self.cur.execute("""SELECT * FROM users_projects WHERE project_id = ?""",(str(project_id),))
        return self.cur.fetchall()
    def get_project_by_id(self,id):
        self.cur.execute("SELECT * FROM projects WHERE id = ?",(str(id),))
        return self.cur.fetchall()
    def update_project(self,project: ProjectContainer) -> str:
        ans = list(dict(project).values())
        ans = ans[1:4]+[ans[-1]]+[ans[0]]
        print(ans)
        self.cur.execute("UPDATE projects SET name = ?,short_description = ?,description = ?, deadline = ? WHERE id = ?",(ans))
        self.con.commit()
    def set_project(self,project: ProjectContainer):
        ans = list(dict(project).values())[1:]
        self.cur.execute("INSERT INTO projects (name,short_description,description,start_date,date_update,deadline) VALUES (?,?,?,?,?,?) RETURNING ID",ans)
        project_id = self.cur.fetchall()[0][0]
        self.con.commit()
        for user in self.get_users():
            if user[2] == 'admin':
                self.set_user_project_connection(user[0],project_id,'admin')
        self.con.commit()
        return project_id

    def delete_project_by_id(self,project_id: int) -> str:
        self.cur.execute("DELETE FROM projects WHERE id = ?",(str(project_id),))
        self.cur.execute("DELETE FROM users_projects WHERE project_id = ?",(str(project_id),))
        self.con.commit()
    
    # task
    def dell_task(self,task_id):
        self.cur.execute("DELETE FROM tasks WHERE id = ?",(str(task_id),))
        self.con.commit()
    def update_task_by_id(self,task_id,name,description,user_id,project_id):
        print((str(name),str(description),str(user_id),str(project_id),str(task_id)))
        self.cur.execute("""UPDATE tasks SET 
        name = ?,
        description = ?,
        user_id = ?,
        project_id = ? WHERE  id = ?""",(str(name),str(description),str(user_id),str(project_id),str(task_id)))
        self.con.commit()
        return self.cur.fetchall()
    def get_user_tasks_by_id(self,id) -> str:
        self.cur.execute("SELECT * FROM tasks WHERE user_id = ? ORDER BY date_update DESC",(str(id),))
        return self.cur.fetchall()
    def get_task_by_id(self,id) -> str:
        self.cur.execute("SELECT * FROM tasks WHERE id = ?",(str(id),))
        return self.cur.fetchall()
    def get_project_tasks_by_id(self,id) -> str:
        self.cur.execute("SELECT * FROM tasks WHERE project_id = ? ORDER BY date_update DESC",(str(id),))
        return self.cur.fetchall()
    def set_task(self,name,description,user_id,project_id) -> str:
        self.cur.execute("INSERT INTO tasks (name,description,user_id,project_id) VALUES (?,?,?,?)",(name,description,user_id,project_id))
        self.con.commit()
    def delete_task_by_id(self,id,state) -> str:
        self.cur.execute("UPDATE tasks SET state = ? WHERE id = ?",(state,id))
        self.con.commit()
    def set_task_state_by_id(self,state,id) ->str:
        self.cur.execute("UPDATE tasks SET states = ? WHERE id = ?",(str(state),str(id)))
        self.con.commit()
        return self.cur.fetchall()
    def set_task_statuses_by_id(self,status,id) ->str:
        self.cur.execute("UPDATE tasks SET states = ? WHERE id = ?",(str(status),str(id)))
        self.con.commit()
        return self.cur.fetchall()