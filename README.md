# SaaS CRM Analyzer

Веб-приложение для сравнительного анализа SaaS-CRM систем малого бизнеса:
- Bitrix24
- amoCRM
- Мегаплан

Архитектура: `React -> Express REST API -> PostgreSQL`.

## Функции

- Управление CRM-системами (CRUD)
- Вкладка `О проекте` с актуальными тарифами CRM
- Управление критериями и весами (CRUD)
- Ввод оценок CRM по критериям
- Автоматический расчёт рейтинга `R = Σ (Wi × Si)`
- Сравнительная таблица и процент от максимума
- Экономический расчёт: TCO, прогнозируемая прибыль, срок окупаемости
- Итоговая рекомендация по внедрению + детальные советы по сегменту компании
- График рейтинга (Chart.js)

## Структура

```text
backend/
  src/
    config/
    controllers/
    middleware/
    models/
    routes/
frontend/
  src/
    api/
    components/
    pages/
db/
  schema.sql
  seed.sql
docker-compose.yml
README.md
```

## REST API

- `GET /api/crm`
- `POST /api/crm`
- `PUT /api/crm/:id`
- `DELETE /api/crm/:id`
- `GET /api/criteria`
- `POST /api/criteria`
- `PUT /api/criteria/:id`
- `DELETE /api/criteria/:id`
- `POST /api/ratings`
- `GET /api/ratings/summary`
- `POST /api/economic`

## Быстрый запуск через Docker

1. Убедитесь, что установлен Docker и Docker Compose.
2. Из корня проекта выполните:

```bash
docker compose up --build
```

3. Откройте:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000/api/health

## Локальный запуск без Docker

### 1) База данных

Создайте БД `crm_analyzer` в PostgreSQL и примените скрипты:

```bash
psql -U postgres -d crm_analyzer -f db/schema.sql
psql -U postgres -d crm_analyzer -f db/seed.sql
```

### 2) Backend

```bash
cd backend
copy .env.example .env
npm install
npm run dev
```

### 3) Frontend

```bash
cd frontend
copy .env.example .env
npm install
npm start
```

## Пример экономического запроса

`POST /api/economic`

```json
{
  "company_name": "ООО Ромашка",
  "number_of_employees": 15,
  "monthly_sales": 1500000,
  "expected_growth": 12,
  "license_cost_per_user": 1200
}
```

## Расширение проекта

- Добавление новых CRM: через интерфейс страницы `CRM`.
- Добавление новых критериев: через страницу `Критерии`.
- Возможные next steps:
  - JWT авторизация (аналитик/просмотр)
  - Экспорт в Excel
  - Роли и аудит изменений
