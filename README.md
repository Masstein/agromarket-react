## Продакшен

- Сайт: https://agromarket-react-eta.vercel.app (укажите точный адрес вашего проекта на Vercel)
- API: https://agromarket-api-masstein.onrender.com/api/health
- Схема: React (Vercel) → Express (Render, Frankfurt) → PostgreSQL (Neon, Frankfurt)

### Переменные окружения (значения — только в панелях сервисов)

| Переменная | Где задана | Секрет |
|---|---|---|
| DATABASE_URL | Render | да |
| JWT_SECRET | Render | да |
| CORS_ORIGIN | Render | нет |
| VITE_API_URL | Vercel | нет |
| RENDER_DEPLOY_HOOK_URL | GitHub Secrets | да |

### Как происходит деплой
1. Изменения — только через Pull Request: CI + ревью
2. Merge в main → CI: test → deploy (Render deploy hook, ref = SHA) → smoke
3. React собирается Vercel из main автоматически
4. Авария: Rollback на Render, затем git revert через PR
