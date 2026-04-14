import React, { useEffect, useMemo, useState } from 'react';
import api from '../api/client';

const initialForm = {
  name: '',
  weight: '',
  criterion_type: '',
  description: ''
};

const CriteriaPage = () => {
  const [criteria, setCriteria] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    const { data } = await api.get('/criteria');
    setCriteria(data);
  };

  useEffect(() => {
    load();
  }, []);

  const stats = useMemo(() => {
    const total = criteria.length;
    const totalWeight = criteria.reduce((sum, item) => sum + Number(item.weight || 0), 0);
    const avgWeight = total ? totalWeight / total : 0;
    return { total, totalWeight, avgWeight };
  }, [criteria]);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const payload = {
        ...form,
        weight: Number(form.weight)
      };

      if (editingId) {
        await api.put(`/criteria/${editingId}`, payload);
      } else {
        await api.post('/criteria', payload);
      }

      setForm(initialForm);
      setEditingId(null);
      await load();
    } catch {
      setError('Не удалось сохранить критерий. Проверьте введённые данные.');
    }
  };

  const edit = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      weight: item.weight,
      criterion_type: item.criterion_type || '',
      description: item.description || ''
    });
  };

  const remove = async (id) => {
    setError('');
    try {
      await api.delete(`/criteria/${id}`);
      await load();
    } catch {
      setError('Не удалось удалить критерий.');
    }
  };

  return (
    <section>
      <div className="page-header">
        <div>
          <h2>Критерии оценки</h2>
          <p>Добавляйте критерии, задавайте вес и управляйте приоритетами анализа.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-title">Всего критериев</p>
          <p className="stat-value">{stats.total}</p>
        </div>
        <div className="stat-card">
          <p className="stat-title">Сумма весов</p>
          <p className="stat-value">{stats.totalWeight.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <p className="stat-title">Средний вес</p>
          <p className="stat-value">{stats.avgWeight.toFixed(2)}</p>
        </div>
      </div>

      <div className="panel">
        <p className="panel-title">Форма критерия</p>
        <form className="form" onSubmit={submit}>
          <input
            placeholder="Название критерия"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="number"
            min="0"
            step="0.1"
            placeholder="Вес"
            value={form.weight}
            onChange={(e) => setForm({ ...form, weight: e.target.value })}
            required
          />
          <input
            placeholder="Тип критерия"
            value={form.criterion_type}
            onChange={(e) => setForm({ ...form, criterion_type: e.target.value })}
          />
          <input
            placeholder="Описание"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <button type="submit">
            {editingId ? 'Сохранить изменения' : 'Добавить критерий'}
          </button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>

      <div className="panel">
        <p className="panel-title">Матрица критериев</p>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Критерий</th>
                <th>Вес</th>
                <th>Тип</th>
                <th>Описание</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {criteria.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.weight}</td>
                  <td>{item.criterion_type || '—'}</td>
                  <td>{item.description || '—'}</td>
                  <td className="actions">
                    <button type="button" onClick={() => edit(item)}>Изменить</button>
                    <button type="button" className="danger" onClick={() => remove(item.id)}>
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default CriteriaPage;
