import React, { useEffect, useState } from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import CrmPage from './pages/CrmPage';
import CriteriaPage from './pages/CriteriaPage';
import RatingsPage from './pages/RatingsPage';
import ComparisonPage from './pages/ComparisonPage';
import EconomicPage from './pages/EconomicPage';

const IconHome = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M3 10.5L12 3l9 7.5V21a1 1 0 01-1 1h-5.5v-6h-5v6H4a1 1 0 01-1-1v-10.5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);

const IconInfo = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
    <path d="M12 10.5v6M12 7.5h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const IconCrm = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3" y="4" width="18" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
    <path d="M3 9h18M8 13h8M8 16h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const IconCriteria = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M8 7h12M8 12h12M8 17h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="4.5" cy="7" r="1.5" fill="currentColor" />
    <circle cx="4.5" cy="12" r="1.5" fill="currentColor" />
    <circle cx="4.5" cy="17" r="1.5" fill="currentColor" />
  </svg>
);

const IconRatings = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 20V11M10 20V7M16 20V13M22 20V4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const IconComparison = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 19h16M6 17V9m6 8V5m6 12v-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const IconEconomics = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 3v18M8.5 7.5h5a2.5 2.5 0 010 5h-3a2.5 2.5 0 100 5h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconMenu = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const navItems = [
  { path: '/', label: 'Главная', icon: IconHome, end: true },
  { path: '/about', label: 'О проекте', icon: IconInfo },
  { path: '/crm', label: 'CRM', icon: IconCrm },
  { path: '/criteria', label: 'Критерии', icon: IconCriteria },
  { path: '/ratings', label: 'Оценки', icon: IconRatings },
  { path: '/comparison', label: 'Сравнение', icon: IconComparison },
  { path: '/economic', label: 'Экономика', icon: IconEconomics }
];

const App = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (mobileSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileSidebarOpen]);

  return (
    <div className="app-shell">
      <button
        className={`sidebar-overlay ${mobileSidebarOpen ? 'show' : ''}`}
        aria-label="Закрыть меню"
        onClick={() => setMobileSidebarOpen(false)}
      />

      <aside className={`sidebar ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
        <div className="brand">
          <div className="brand-dot" />
          <div>
            <p className="brand-title">SaaS CRM</p>
            <p className="brand-subtitle">Decision Dashboard</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={() => setMobileSidebarOpen(false)}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <span className="sidebar-link-icon">
                <item.icon />
              </span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="mobile-menu-btn"
              aria-label="Открыть меню"
              onClick={() => setMobileSidebarOpen((prev) => !prev)}
            >
              <IconMenu />
            </button>
            <div>
              <p className="topbar-kicker">Flowbite-style UI</p>
              <h1 className="topbar-title">Анализ и выбор SaaS-CRM</h1>
            </div>
          </div>
          <div className="topbar-user">
            <span className="status-pill">Online</span>
            <div className="user-avatar">A</div>
          </div>
        </header>

        <main className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/crm" element={<CrmPage />} />
            <Route path="/criteria" element={<CriteriaPage />} />
            <Route path="/ratings" element={<RatingsPage />} />
            <Route path="/comparison" element={<ComparisonPage />} />
            <Route path="/economic" element={<EconomicPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
