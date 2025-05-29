import express from 'express';              // Импортируем Express для работы с HTTP-сервером
import http from 'http';                    // Импортируем http для создания низкоуровневого сервера
import bodyParser from 'body-parser';       // Для парсинга JSON тела запроса
import cookieParser from  'cookie-parser';  // Для обработки cookies в запросах
import compression from 'compression';      // Для сжатия HTTP-ответов (для улучшения производительности)
import cors from 'cors';                    // Для разрешения кросс-доменных запросов (CORS)
import sqlite from 'sqlite3';

const app = express();
const port = 8080;
app.use(cors({
    credentials: true,
}));

app.use(compression()); // Включаем сжатие для всех ответов
app.use(cookieParser()); // Включаем middleware для работы с cookies
app.use(bodyParser.json()); // Включаем middleware для парсинга JSON тела запросов

app.get('/', (request, response) => {
    response.send('Hello world!');
});

const server = http.createServer(app);

server.listen(port, () => console.log(`Running on http://localhost:${port}/`));

