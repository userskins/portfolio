# UserSkins Portfolio

Полноценное React/Express‑приложение, собранное через Vite и esbuild. Клиент собирается в `dist/public`, а серверный бандл попадает в `dist/index.js`, откуда обслуживает API и статические файлы.

## Локальный запуск

1. Установите зависимости: `npm install`.
2. Запустите сервер разработки: `npm run dev` (API) и `npm run dev:client` при необходимости отдельного hot‑reload для клиента.

## Сборка продакшена

```
npm run build
npm run start
```

## Деплой на Render

Файл `render.yaml` описывает веб‑сервис Render:

- тип: `web`, среда: `node`, регион: `oregon`, план: `free`;
- `buildCommand`: `npm install && npm run build`;
- `startCommand`: `npm run start`;
- `nodeVersion`: `20`, `NODE_ENV=production`.

### Пошагово

1. Закоммитьте изменения и запушьте репозиторий в GitHub.
2. В Render создайте **New + → Blueprint** и укажите ссылку на репозиторий. Render подтянет `render.yaml` и предложит создать сервис `userskins-portfolio`.
3. При необходимости задайте собственные переменные окружения (например, креды БД) в разделе **Environment**.
4. Нажмите **Apply** — Render выполнит `npm install && npm run build`, после чего запустит `npm run start`.
5. Дождитесь статуса **Live** и проверьте URL сервиса.

### Полезные заметки

- Приложение слушает порт `PORT`, который Render задаёт автоматически.
- Все статические ассеты после сборки оказываются в `dist/public` и обслуживаются Express.
- Для деплоя из другой ветки обновите поле `branch` в созданном сервисе или отредактируйте blueprint.

