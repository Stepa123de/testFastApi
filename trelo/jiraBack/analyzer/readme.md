# Структура

```
└── api (файлы запросов)
    ├── get_request.py( запросы )
    ├── post_request.py( запросы )
    ├── patch_request.py( запросы )
    ├── delete_request.py( запросы )
    ├── site_request.py( запросы для http страниц)
    └── __init__.py ( файл компановки )
```

```
└── db
    ├── testFields.py ( создание базовых записей, не очищает существующие )
    ├── schema.py ( схемы таблиц )
    └── create_token.py ( создание и расшифровка токена )
```

```
└── files_db
    └── my_database.db ( база данных )
```

```
└── utils
    ├── create_token.py( работа стокеном создание / проверка )
    └── mytypes.py ( типы данных, для запросов main.py )
```
