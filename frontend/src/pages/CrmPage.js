import React, { useEffect, useMemo, useState } from 'react';
import api from '../api/client';
import {
  crmPricing,
  pricingCurrency,
  pricingFxNote,
  pricingLastUpdated
} from '../data/crmPricing';

const initialForm = {
  name: '',
  description: '',
  base_price: '',
  website_url: ''
};

const defaultCrmRows = [
  {
    name: 'Bitrix24',
    description: 'SaaS-CRM с акцентом на совместную работу и автоматизацию процессов',
    base_price: 120,
    website_url: 'https://www.bitrix24.ru/'
  },
  {
    name: 'amoCRM',
    description: 'CRM для управления продажами и коммуникациями с клиентами',
    base_price: 71.88,
    website_url: 'https://www.amocrm.ru/'
  },
  {
    name: 'Мегаплан',
    description: 'CRM и управление задачами для малого бизнеса',
    base_price: 37.8,
    website_url: 'https://megaplan.ru/'
  }
];

const CrmPage = () => {
  const [list, setList] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const load = async () => {
    const { data } = await api.get('/crm');
    setList(data);
  };

  useEffect(() => {
    load();
  }, []);

  const stats = useMemo(() => {
    const count = list.length;
    const avgPrice = count
      ? list.reduce((sum, row) => sum + Number(row.base_price || 0), 0) / count
      : 0;
    const withSite = list.filter((row) => Boolean(row.website_url)).length;
    return { count, avgPrice, withSite };
  }, [list]);

  const pricingByCrm = useMemo(() => {
    const map = new Map();
    crmPricing.forEach((item) => {
      const minConfig = [...item.configs].sort((a, b) => a.price - b.price)[0];
      map.set(item.crm.toLowerCase(), {
        minConfigName: minConfig?.name || '—',
        minConfigPrice: minConfig?.price ?? null,
        minConfigIncludes: minConfig?.includes?.slice(0, 2).join(', ') || '—'
      });
    });
    return map;
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setInfo('');
    try {
      const payload = {
        ...form,
        base_price: Number(form.base_price) || 0
      };

      if (editingId) {
        await api.put(`/crm/${editingId}`, payload);
      } else {
        await api.post('/crm', payload);
      }

      setForm(initialForm);
      setEditingId(null);
      await load();
    } catch {
      setError('Не удалось сохранить CRM. Проверьте корректность данных.');
    }
  };

  const importDefaultCrm = async () => {
    setError('');
    setInfo('');
    try {
      const existingNames = new Set(list.map((item) => item.name.toLowerCase()));
      const rowsToCreate = defaultCrmRows.filter(
        (row) => !existingNames.has(row.name.toLowerCase())
      );

      await Promise.all(rowsToCreate.map((row) => api.post('/crm', row)));
      await load();

      if (rowsToCreate.length === 0) {
        setInfo('Базовый список уже добавлен.');
      } else {
        setInfo(`Добавлено: ${rowsToCreate.map((row) => row.name).join(', ')}.`);
      }
    } catch {
      setError('Не удалось импортировать базовый список CRM.');
    }
  };

  const edit = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      description: item.description || '',
      base_price: item.base_price,
      website_url: item.website_url || ''
    });
  };

  const remove = async (id) => {
    setError('');
    setInfo('');
    try {
      await api.delete(`/crm/${id}`);
      await load();
    } catch {
      setError('Не удалось удалить CRM.');
    }
  };

  return (
    <section>
      <div className="page-header">
        <div>
          <h2>CRM-системы</h2>
          <p>
            Управляйте списком CRM, базовыми ценами и ссылками на официальные сайты.
          </p>
        </div>
        <span className="badge">Тарифы обновлены: {pricingLastUpdated}</span>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-title">Всего CRM</p>
          <p className="stat-value">{stats.count}</p>
        </div>
        <div className="stat-card">
          <p className="stat-title">Средняя базовая цена</p>
          <p className="stat-value">
            {stats.avgPrice.toFixed(2)} {pricingCurrency}
          </p>
        </div>
        <div className="stat-card">
          <p className="stat-title">CRM с официальным сайтом</p>
          <p className="stat-value">{stats.withSite}</p>
        </div>
      </div>

      <div className="page-grid">
        <div className="panel">
          <p className="panel-title">Карточка CRM</p>
          <form className="form" onSubmit={submit}>
            <input
              placeholder="Название CRM"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              placeholder="Описание"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder={`Базовая цена (${pricingCurrency})`}
              value={form.base_price}
              onChange={(e) => setForm({ ...form, base_price: e.target.value })}
            />
            <input
              type="url"
              placeholder="URL сайта"
              value={form.website_url}
              onChange={(e) => setForm({ ...form, website_url: e.target.value })}
            />
            <button type="submit">
              {editingId ? 'Сохранить изменения' : 'Добавить CRM'}
            </button>
            <button type="button" onClick={importDefaultCrm}>
              Импортировать Bitrix24 / amoCRM / Мегаплан
            </button>
          </form>
          {error && <p className="error">{error}</p>}
          {info && <p className="info">{info}</p>}
        </div>

        <div className="panel">
          <p className="panel-title">Конфигурации и цены ({pricingCurrency})</p>
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
                          {config.promoPrice
                            ? ` • акция ${config.promoPrice.toFixed(2)} ${pricingCurrency}`
                            : ''}
                          {config.oldPrice
                            ? ` • было ${config.oldPrice.toFixed(2)} ${pricingCurrency}`
                            : ''}
                        </td>
                        <td>{config.includes.join(', ')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {crm.note && <p className="stat-note">{crm.note}</p>}
            </article>
          ))}
        </div>
      </div>

      <div className="panel">
        <p className="panel-title">Реестр CRM-систем</p>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Название</th>
                <th>Описание</th>
                <th>Мин. конфигурация</th>
                <th>Мин. цена ({pricingCurrency})</th>
                <th>Что входит (кратко)</th>
                <th>Сайт</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item) => (
                (() => {
                  const pricingMeta = pricingByCrm.get(item.name.toLowerCase());
                  return (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td>{pricingMeta?.minConfigName || '—'}</td>
                  <td>
                    {pricingMeta?.minConfigPrice !== null
                      ? Number(pricingMeta.minConfigPrice).toFixed(2)
                      : '—'}
                  </td>
                  <td>{pricingMeta?.minConfigIncludes || '—'}</td>
                  <td>
                    {item.website_url ? (
                      <a href={item.website_url} target="_blank" rel="noreferrer">
                        Открыть
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="actions">
                    <button type="button" onClick={() => edit(item)}>Изменить</button>
                    <button type="button" className="danger" onClick={() => remove(item.id)}>
                      Удалить
                    </button>
                  </td>
                </tr>
                  );
                })()
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default CrmPage;
