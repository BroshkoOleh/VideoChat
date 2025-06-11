# WebSocket Server для Video Calls

## Встановлення

```bash
cd server
npm install
```

## Запуск

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

Сервер запуститься на порту 3001.

## Endpoints

- `http://localhost:3001/health` - Перевірка стану серверу
- `http://localhost:3001/calls` - Список активних дзвінків

## WebSocket Events

### Client -> Server
- `register-user` - Реєстрація користувача
- `initiate-call` - Ініціація дзвінка
- `accept-call` - Прийняття дзвінка
- `reject-call` - Відхилення дзвінка
- `end-call` - Завершення дзвінка
- `cancel-call` - Скасування дзвінка
- `get-online-users` - Отримання списку онлайн користувачів

### Server -> Client
- `users-updated` - Оновлення списку користувачів
- `incoming-call` - Вхідний дзвінок
- `call-accepted` - Дзвінок прийнято
- `call-rejected` - Дзвінок відхилено
- `call-cancelled` - Дзвінок скасовано
- `call-ended` - Дзвінок завершено

## Структура проекту

```
server/
├── package.json
├── server.js          # Основний файл серверу
└── README.md          # Документація
```

## Налаштування

Сервер налаштований на роботу з React додатком на `http://localhost:5173` (Vite dev server).

Для зміни налаштувань відредагуйте CORS конфігурацію в `server.js`. 