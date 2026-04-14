import React from 'react';
import {
  crmPricing,
  pricingCurrency,
  pricingFxNote,
  pricingLastUpdated
} from '../data/crmPricing';

const AboutPage = () => {
  return (
    <section>
      <div className="page-header">
        <div>
          <h2>О проекте</h2>
          <p>
            Платформа помогает выбрать CRM на основе взвешенной оценки критериев и
            экономического расчета внедрения.
          </p>
        </div>
      </div>

      <div className="panel">
        <p className="panel-title">Архитектура</p>
        <p className="panel-text">
          React (Frontend) → Express REST API (Backend) → PostgreSQL (Data Layer)
        </p>
      </div>

      <div className="panel">
        <div className="panel-head-row">
          <p className="panel-title">Конфигурации CRM и цены для Таджикистана ({pricingCurrency})</p>
          <span className="badge">Обновлено: {pricingLastUpdated}</span>
        </div>
        <p className="stat-note">{pricingFxNote}</p>

        {crmPricing.map((crm) => (
          <article key={crm.crm} className="pricing-card pricing-card-large">
            <div className="pricing-card-head">
              <p className="pricing-name">{crm.crm}</p>
              <a href={crm.source} target="_blank" rel="noreferrer">Источник</a>
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Конфигурация</th>
                    <th>Цена</th>
                    <th>Что входит</th>
                  </tr>
                </thead>
                <tbody>
                  {crm.configs.map((config) => (
                    <tr key={`${crm.crm}-${config.name}`}>
                      <td>{config.name}</td>
                      <td>
                        {config.price.toFixed(2)} {pricingCurrency} {config.period}
                        {config.promoPrice ? ` • акция ${config.promoPrice.toFixed(2)} ${pricingCurrency}` : ''}
                        {config.oldPrice ? ` • было ${config.oldPrice.toFixed(2)} ${pricingCurrency}` : ''}
                      </td>
                      <td>
                        {config.includes.join(', ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {crm.note && <p className="stat-note">{crm.note}</p>}
          </article>
        ))}
      </div>
    </section>
  );
};

export default AboutPage;
