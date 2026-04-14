import React, { useEffect, useMemo, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import api from '../api/client';
import DataTable from '../components/DataTable';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ComparisonPage = () => {
  const [summary, setSummary] = useState([]);
  const [matrix, setMatrix] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get('/ratings/summary');
      setSummary(data.summary || []);
      setMatrix(data.matrix || []);
    };

    load();
  }, []);

  const tableData = useMemo(() => {
    if (!summary.length || !matrix.length) {
      return { headers: [], rows: [] };
    }

    const criterionNames = [...new Set(matrix.map((row) => row.criterion_name))];
    const bestId = summary[0]?.id;

    const rows = summary.map((crm) => {
      const rowValues = [crm.name];
      criterionNames.forEach((criterionName) => {
        const cell = matrix.find(
          (item) => item.crm_id === crm.id && item.criterion_name === criterionName
        );
        rowValues.push(cell?.score ?? '-');
      });
      rowValues.push(Number(crm.rating).toFixed(2));
      rowValues.push(`${crm.percent_of_max}%`);

      return {
        isBest: crm.id === bestId,
        values: rowValues
      };
    });

    return {
      headers: ['CRM', ...criterionNames, 'Итоговый рейтинг', '% от максимума'],
      rows
    };
  }, [summary, matrix]);

  const chartData = {
    labels: summary.map((item) => item.name),
    datasets: [
      {
        label: 'Рейтинг CRM',
        data: summary.map((item) => Number(item.rating)),
        borderRadius: 10,
        borderSkipped: false,
        maxBarThickness: 44,
        backgroundColor: (context) => {
          const { chart } = context;
          const { ctx, chartArea } = chart;
          if (!chartArea) {
            return '#3b82f6';
          }
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, '#60a5fa');
          gradient.addColorStop(1, '#2563eb');
          return gradient;
        }
      },
      {
        label: 'Максимально возможный',
        data: summary.map((item) => Number(item.max_rating || 0)),
        borderRadius: 10,
        borderSkipped: false,
        maxBarThickness: 44,
        backgroundColor: '#e5e7eb'
      }
    ]
  };

  const chartOptions = {
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          boxHeight: 12,
          usePointStyle: true,
          pointStyle: 'circle',
          color: '#6b7280',
          font: {
            family: 'Inter, Segoe UI, Arial, sans-serif',
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: '#111827',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        padding: 10,
        displayColors: true,
        callbacks: {
          label: (context) =>
            `${context.dataset.label}: ${Number(context.parsed.y).toFixed(2)}`
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#6b7280'
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#e5e7eb',
          drawBorder: false
        },
        ticks: {
          color: '#6b7280'
        }
      }
    }
  };

  const leader = summary[0];

  return (
    <section>
      <div className="page-header">
        <div>
          <h2>Сравнение CRM</h2>
          <p>Динамическая таблица и график рейтингов на основе взвешенных оценок.</p>
        </div>
      </div>

      {!tableData.headers.length ? (
        <div className="panel">
          <p className="panel-text">
            Добавьте критерии и оценки, чтобы сформировать сравнительный отчёт.
          </p>
        </div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <p className="stat-title">Лидер рейтинга</p>
              <p className="stat-value">{leader?.name}</p>
            </div>
            <div className="stat-card">
              <p className="stat-title">Рейтинг лидера</p>
              <p className="stat-value">{Number(leader?.rating || 0).toFixed(2)}</p>
            </div>
            <div className="stat-card">
              <p className="stat-title">Процент от максимума</p>
              <p className="stat-value">{leader?.percent_of_max || 0}%</p>
            </div>
          </div>

          <div className="panel">
            <p className="panel-title">Сравнительная таблица</p>
            <DataTable headers={tableData.headers} rows={tableData.rows} />
          </div>

          <div className="panel">
            <p className="panel-title">График рейтинга</p>
            <div className="chart-card no-margin chart-wrap">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default ComparisonPage;
