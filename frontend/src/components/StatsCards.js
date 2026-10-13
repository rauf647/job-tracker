import React from 'react';
import { Briefcase, Clock, CheckCircle, XCircle, Gift, Calendar } from 'lucide-react';

const StatsCards = ({ stats }) => {
  const cards = [
    {
      label: 'Total',
      value: stats.total || 0,
      icon: <Briefcase size={22} />,
      color: '#6366f1',
      glow: 'rgba(99, 102, 241, 0.15)'
    },
    {
      label: 'Applied',
      value: stats.applied || 0,
      icon: <Clock size={22} />,
      color: '#38bdf8',
      glow: 'rgba(56, 189, 248, 0.15)'
    },
    {
      label: 'Interviews',
      value: stats.interview || 0,
      icon: <Calendar size={22} />,
      color: '#fbbf24',
      glow: 'rgba(251, 191, 36, 0.15)'
    },
    {
      label: 'Selected',
      value: stats.selected || 0,
      icon: <CheckCircle size={22} />,
      color: '#34d399',
      glow: 'rgba(52, 211, 153, 0.15)'
    },
    {
      label: 'Offers',
      value: stats.offer || 0,
      icon: <Gift size={22} />,
      color: '#a78bfa',
      glow: 'rgba(167, 139, 250, 0.15)'
    },
    {
      label: 'Rejected',
      value: stats.rejected || 0,
      icon: <XCircle size={22} />,
      color: '#f87171',
      glow: 'rgba(248, 113, 113, 0.15)'
    }
  ];

  return (
    <div className="stats-grid">
      {cards.map((card, index) => (
        <div
          key={index}
          className="stat-card"
          style={{
            '--card-accent': card.color,
            '--card-glow': card.glow,
            animationDelay: `${index * 80}ms`
          }}
        >
          <div
            className="stat-icon"
            style={{
              color: card.color,
              background: card.glow,
              boxShadow: `0 0 12px ${card.glow}`
            }}
          >
            {card.icon}
          </div>
          <div className="stat-info">
            <span className="stat-value" style={{ color: card.color }}>
              {card.value}
            </span>
            <span className="stat-label">{card.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
