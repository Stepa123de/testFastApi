# Ограничение на статусы проекта(по умолчанию задается первый статус)
# status TEXT DEFAULT ('not started') CHECK(status IN ({})),
projects_status = ['not started', 'in progress', 'paused', 'completed']

# Ограничения на состояния и статусы задачи
tasks_states = ['not started','in progress', 'completed']
tasks_statuses = ['waiting','active', 'paused', 'accepted', 'not accepted']
users_role =['support','admin']

# Таблица проектов
tabel_projects = """CREATE TABLE IF NOT EXISTS projects(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    short_description TEXT,
    description TEXT,
    start_date DATE DEFAULT (DATE('now')),
    date_update DATE DEFAULT (DATE('now')),
    deadline DATE);
"""

# Таблица пользователей
tabel_users = """CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT DEFAULT ('support') CHECK(role IN ({})),
    password TEXT NOT NULL);
""".format(str(users_role)[1:-1])

# Таблица связи пользователей и проектов
tabel_users_projects = """CREATE TABLE IF NOT EXISTS users_projects(
    user_id INTEGER,
    project_id INTEGER,
    role TEXT DEFAULT ('support') CHECK(role IN ({})),
    PRIMARY KEY (user_id,project_id),
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(project_id) REFERENCES projects(id));
""".format(str(users_role)[1:-1])

# Таблица задач
tabel_tasks = """CREATE TABLE IF NOT EXISTS tasks(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    states INTEGER DEFAULT 0,
    statuses INTEGER DEFAULT 0,
    user_id INTEGER NOT NULL,
    project_id INTEGER NOT NULL,
    date_update DATETIME DEFAULT (DATETIME('now')),
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(project_id) REFERENCES projects(id));
"""

# Тригер 
triger_tasks_update = """
    CREATE TRIGGER tasks_update
    AFTER UPDATE ON tasks
    FOR EACH ROW
    WHEN NEW.name != OLD.name OR 
        NEW.description != OLD.description OR
        NEW.states != OLD.states OR
        NEW.statuses != OLD.statuses
    BEGIN
        UPDATE tasks SET date_update = DATETIME('now') 
        WHERE id = NEW.id;
    END;
"""
triger_projects_update = """
    CREATE TRIGGER triger_projects_update
    AFTER UPDATE ON projects
    FOR EACH ROW
    WHEN NEW.name != OLD.name OR 
        NEW.description != OLD.description OR
        NEW.short_description != OLD.short_description OR
        NEW.deadline != OLD.deadline
    BEGIN
        UPDATE projects SET date_update = DATE('now') 
        WHERE id = NEW.id;
    END;
"""