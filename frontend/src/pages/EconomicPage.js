import React, { useState } from 'react';
import api from '../api/client';

const EconomicPage = () => {
  const [form, setForm] = useState({
    company_name: '',
    number_of_employees: '',
    monthly_sales: '',
    expected_growth: '',
    license_cost_per_user: ''
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    const payload = {
      ...form,
      number_of_employees: Number(form.number_of_employees),
      monthly_sales: Number(form.monthly_sales),
      expected_growth: Number(form.expected_growth),
      license_cost_per_user: Number(form.license_cost_per_user)
    };

    try {
      const { data } = await api.post('/economic', payload);
      setResult(data);
    } catch {
      setError('Ошибка расчёта. Проверьте введённые данные.');
    }
  };

  return (
    <section>
      <div className="page-header">
        <div>
          <h2>Экономическое обоснование</h2>
          <p>Рассчитайте TCO, прогнозируемую прибыль и срок окупаемости внедрения CRM.</p>
        </div>
      </div>

      <div className="page-grid">
        <div className="panel">
          <p className="panel-title">Входные параметры</p>
          <form className="form" onSubmit={submit}>
            <input
              placeholder="Название компании"
              value={form.company_name}
              onChange={(e) => setForm({ ...form, company_name: e.target.value })}
              required
            />
            <input
              type="number"
              min="1"
              placeholder="Количество сотрудников"
              value={form.number_of_employees}
              onChange={(e) => setForm({ ...form, number_of_employees: e.target.value })}
              required
            />
            <input
              type="number"
              min="0"
              placeholder="Сумма продаж в месяц"
              value={form.monthly_sales}
              onChange={(e) => setForm({ ...form, monthly_sales: e.target.value })}
              required
            />
            <input
              type="number"
              min="0"
              step="0.1"
              placeholder="Прогнозируемый рост продаж (%)"
              value={form.expected_growth}
              onChange={(e) => setForm({ ...form, expected_growth: e.target.value })}
              required
            />
            <input
              type="number"
              min="0"
              placeholder="Стоимость лицензии за пользователя"
              value={form.license_cost_per_user}
              onChange={(e) => setForm({ ...form, license_cost_per_user: e.target.value })}
              required
            />
            <button type="submit">Рассчитать экономику</button>
          </form>
          {error && <p className="error">{error}</p>}
        </div>

        <div className="panel">
          <p className="panel-title">Результаты расчёта</p>
          {!result ? (
            <p className="panel-text">После расчёта здесь появятся финансовые показатели и рекомендации.</p>
          ) : (
            <>
              <div className="stats-grid">
                <div className="stat-card">
                  <p className="stat-title">Годовые затраты (TCO)</p>
                  <p className="stat-value">{Number(result.annual_cost).toFixed(2)} ₽</p>
                </div>
                <div className="stat-card">
                  <p className="stat-title">Прогнозируемая прибыль</p>
                  <p className="stat-value">{Number(result.projected_annual_profit).toFixed(2)} ₽</p>
                </div>
                <div className="stat-card">
                  <p className="stat-title">Окупаемость</p>
                  <p className="stat-value">
                    {result.payback_months
                      ? `${Number(result.payback_months).toFixed(2)} мес`
                      : 'Невозможно рассчитать'}
                  </p>
                </div>
              </div>

              <div className="result-card no-margin">
                <p><strong>Сегмент компании:</strong> {result.company_profile.employee_segment}</p>
                <p><strong>Сегмент продаж:</strong> {result.company_profile.sales_segment}</p>
                <p>
                  <strong>Доля затрат CRM от годовой выручки:</strong>{' '}
                  {Number(result.company_profile.crm_cost_share_percent).toFixed(2)}%
                </p>
                <p><strong>Итоговая рекомендация:</strong> {result.recommendation}</p>
              </div>

              {result.recommendation_details?.length > 0 && (
                <div className="result-card">
                  <p className="panel-title">Практические рекомендации</p>
                  {result.recommendation_details.map((item) => (
                    <p key={item}>• {item}</p>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default EconomicPage;
