import React from 'react';
import { Link } from 'react-router-dom';

const cards = [
  { to: '/about', title: 'О проекте', description: 'Цель, методика и актуальные тарифы CRM' },
  { to: '/crm', title: 'CRM-системы', description: 'Список платформ, конфигурации и цены' },
  { to: '/criteria', title: 'Критерии', description: 'Настройка весов и параметров оценки' },
  { to: '/ratings', title: 'Оценки CRM', description: 'Ввод оценок и комментариев экспертов' },
  { to: '/comparison', title: 'Сравнение', description: 'Рейтинг, таблица и визуализация' },
  { to: '/economic', title: 'Экономика', description: 'TCO, окупаемость и рекомендации' }
];

const HomePage = () => {
  return (
    <section>
      <div className="page-header">
        <div>
          <h2>Выбор и экономическое обоснование SaaS-CRM</h2>
          <p>Дашборд для малого бизнеса: оценка CRM по критериям, рейтинг и ROI-анализ.</p>
        </div>
        <span className="badge">Flowbite style</span>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-title">Поддерживаемые CRM</p>
          <p className="stat-value">3</p>
          <p className="stat-note">Bitrix24, amoCRM, Мегаплан</p>
        </div>
        <div className="stat-card">
          <p className="stat-title">Оценочная модель</p>
          <p className="stat-value">Σ(W × S)</p>
          <p className="stat-note">Взвешенный рейтинг по критериям</p>
        </div>
        <div className="stat-card">
          <p className="stat-title">Экономика внедрения</p>
          <p className="stat-value">TCO + Payback</p>
          <p className="stat-note">Годовая стоимость и срок окупаемости</p>
        </div>
      </div>

      <div className="card-grid">
        {cards.map((item) => (
          <Link key={item.to} className="card" to={item.to}>
            <p className="card-title">{item.title}</p>
            <p className="card-text">{item.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default HomePage;
