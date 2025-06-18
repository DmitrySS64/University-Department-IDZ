FROM python:3.11-slim

# Установка зависимостей
RUN apt-get update && apt-get install -y sqlite3 && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY req.txt .
RUN pip install --no-cache-dir -r req.txt

COPY app ./app
COPY init.sql .

# Инициализируем БД (если нужно)
RUN sqlite3 db.sqlite < init.sql

# Открываем порт
#EXPOSE 8000

# Запускаем FastAPI
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
