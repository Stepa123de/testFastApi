# Структура

```
└── css / html / js
    ├── login.*
    ├── main.*
    ├── project_panel.*
    ├── project.*
    └── tasks.*
```
### login.* страница входа
### main.* страница проекта
### project.* страница создания редактирования проекта
### tasks.* страница кантбан с задачами

# Логика переходов
```
start
└── login.*
    └── main.*
```
```
└── main.*
    ├── taks.*
    ├── project.*
    ├── project_panel.*
    └── login.*
```
```
└── tasks.*
    ├── main.*
    └── login.*
```
```
└── project.*
    └── main.*
```
```
└── project_panel.*
    ├── taks.*
    └── main.*
```
# Логика ошибочных переходов
### при переходе без прохождение регистрации или других махинациях
```
start (ro login without logining)
└── main.* / tasks.* / project.*
    └── login.*
```
```
main.* (don't choes project)
└── tasks.*
    └── main.*
```
