import React, { useEffect, useMemo, useState } from 'react';
import api from '../api/client';

const RatingsPage = () => {
  const [crmList, setCrmList] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [crmId, setCrmId] = useState('');
  const [scores, setScores] = useState({});
  const [comments, setComments] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      const [crmRes, criteriaRes] = await Promise.all([api.get('/crm'), api.get('/criteria')]);
      setCrmList(crmRes.data);
      setCriteria(criteriaRes.data);
      if (crmRes.data.length > 0) {
        setCrmId(String(crmRes.data[0].id));
      }
    };

    load();
  }, []);

  const filledScores = useMemo(
    () => Object.values(scores).filter((value) => Number(value) > 0).length,
    [scores]
  );

  const saveRatings = async (event) => {
    event.preventDefault();
    setMessage('');

    if (!crmId) {
      setMessage('Сначала добавьте CRM-системы.');
      return;
    }

    try {
      await Promise.all(
        criteria.map((criterion) => {
          const score = Number(scores[criterion.id] || 0);
          if (!score) {
            return Promise.resolve();
          }

          return api.post('/ratings', {
            crm_id: Number(crmId),
            criterion_id: criterion.id,
            score,
            comment: comments[criterion.id] || ''
          });
        })
      );

      setMessage('Оценки успешно сохранены.');
    } catch {
      setMessage('Ошибка сохранения оценок.');
    }
  };

  return (
    <section>
      <div className="page-header">
        <div>
          <h2>Оценка CRM</h2>
          <p>Заполните оценки по каждому критерию в диапазоне 1–10.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-title">CRM в базе</p>
          <p className="stat-value">{crmList.length}</p>
        </div>
        <div className="stat-card">
          <p className="stat-title">Критериев оценки</p>
          <p className="stat-value">{criteria.length}</p>
        </div>
        <div className="stat-card">
          <p className="stat-title">Заполнено оценок</p>
          <p className="stat-value">{filledScores}</p>
        </div>
      </div>

      <div className="panel">
        <p className="panel-title">Форма оценки</p>
        <form className="form" onSubmit={saveRatings}>
          <label className="field-label">CRM-система</label>
          <select value={crmId} onChange={(e) => setCrmId(e.target.value)}>
            {crmList.map((crm) => (
              <option key={crm.id} value={crm.id}>{crm.name}</option>
            ))}
          </select>

          {criteria.map((criterion) => (
            <div key={criterion.id} className="criterion-card">
              <p className="criterion-title">{criterion.name}</p>
              <p className="criterion-note">Вес: {criterion.weight}</p>
              <div className="criterion-grid">
                <input
                  type="number"
                  min="1"
                  max="10"
                  placeholder="Оценка (1–10)"
                  value={scores[criterion.id] || ''}
                  onChange={(e) =>
                    setScores({
                      ...scores,
                      [criterion.id]: e.target.value
                    })
                  }
                />
                <input
                  placeholder="Комментарий"
                  value={comments[criterion.id] || ''}
                  onChange={(e) =>
                    setComments({
                      ...comments,
                      [criterion.id]: e.target.value
                    })
                  }
                />
              </div>
            </div>
          ))}

          <button type="submit">Сохранить оценки</button>
        </form>
        {message && <p className="info">{message}</p>}
      </div>
    </section>
  );
};

export default RatingsPage;
