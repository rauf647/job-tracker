import React from 'react';
import { Building2, FileText, MapPin, Calendar, Tag, Edit3, Trash2, ExternalLink, StickyNote } from 'lucide-react';

const statusConfig = {
  applied: { label: 'Applied', color: 'var(--status-applied)', bg: 'var(--status-applied-bg)', border: 'var(--status-applied-border)' },
  interview: { label: 'Interview', color: 'var(--status-interview)', bg: 'var(--status-interview-bg)', border: 'var(--status-interview-border)' },
  rejected: { label: 'Rejected', color: 'var(--status-rejected)', bg: 'var(--status-rejected-bg)', border: 'var(--status-rejected-border)' },
  selected: { label: 'Selected', color: 'var(--status-selected)', bg: 'var(--status-selected-bg)', border: 'var(--status-selected-border)' },
  offer: { label: 'Offer', color: 'var(--status-offer)', bg: 'var(--status-offer-bg)', border: 'var(--status-offer-border)' }
};

const JobCard = ({ job, onEdit, onDelete }) => {
  const status = statusConfig[job.status] || statusConfig.applied;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleDelete = () => {
    if (window.confirm(`Delete application for "${job.job_title}" at ${job.company_name}?`)) {
      onDelete(job.id);
    }
  };

  return (
    <div className="job-card">
      <div className="job-card-header">
        <div className="job-card-company">
          <Building2 size={18} className="icon-muted" />
          <span className="company-name">{job.company_name}</span>
        </div>
        <span
          className="status-badge"
          style={{
            color: status.color,
            backgroundColor: status.bg,
            borderColor: status.border,
            boxShadow: `0 0 8px ${status.bg.replace('0.1', '0.2')}`
          }}
        >
          {status.label}
        </span>
      </div>

      <div className="job-card-title">
        <FileText size={18} className="icon-muted" />
        <h3>{job.job_title}</h3>
      </div>

      <div className="job-card-meta">
        {job.job_location && (
          <span className="meta-item">
            <MapPin size={14} /> {job.job_location}
          </span>
        )}
        <span className="meta-item">
          <Calendar size={14} /> {formatDate(job.application_date)}
        </span>
        {job.salary_range && (
          <span className="meta-item">
            <Tag size={14} /> {job.salary_range}
          </span>
        )}
      </div>

      {job.notes && (
        <div className="job-card-notes">
          <StickyNote size={14} className="icon-muted" />
          <p>{job.notes.length > 120 ? job.notes.substring(0, 120) + '...' : job.notes}</p>
        </div>
      )}

      {job.job_url && (
        <a
          href={job.job_url}
          target="_blank"
          rel="noopener noreferrer"
          className="job-url-link"
        >
          <ExternalLink size={14} /> View Job Posting
        </a>
      )}

      <div className="job-card-actions">
        <button onClick={() => onEdit(job)} className="btn btn-secondary btn-sm">
          <Edit3 size={15} /> Edit
        </button>
        <button onClick={handleDelete} className="btn btn-danger-outline btn-sm">
          <Trash2 size={15} /> Delete
        </button>
      </div>
    </div>
  );
};

export default JobCard;
