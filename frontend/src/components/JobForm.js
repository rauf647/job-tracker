import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { X, Building2, FileText, MapPin, DollarSign, Calendar, Tag, StickyNote, Link, User, Mail } from 'lucide-react';

const initialFormState = {
  company_name: '',
  job_title: '',
  job_description: '',
  job_location: '',
  salary_range: '',
  application_date: new Date().toISOString().split('T')[0],
  status: 'applied',
  notes: '',
  job_url: '',
  contact_person: '',
  contact_email: ''
};

const JobForm = ({ editingJob, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingJob) {
      setFormData({
        company_name: editingJob.company_name || '',
        job_title: editingJob.job_title || '',
        job_description: editingJob.job_description || '',
        job_location: editingJob.job_location || '',
        salary_range: editingJob.salary_range || '',
        application_date: editingJob.application_date
          ? editingJob.application_date.split('T')[0]
          : new Date().toISOString().split('T')[0],
        status: editingJob.status || 'applied',
        notes: editingJob.notes || '',
        job_url: editingJob.job_url || '',
        contact_person: editingJob.contact_person || '',
        contact_email: editingJob.contact_email || ''
      });
    } else {
      setFormData(initialFormState);
    }
  }, [editingJob]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.company_name.trim() || !formData.job_title.trim()) {
      setError('Company name and job title are required');
      return;
    }

    setLoading(true);

    try {
      if (editingJob) {
        await api.put(`/jobs/${editingJob.id}`, formData);
      } else {
        await api.post('/jobs', formData);
      }
      setFormData(initialFormState);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { value: 'applied', label: 'Applied', color: '#38bdf8' },
    { value: 'interview', label: 'Interview', color: '#fbbf24' },
    { value: 'rejected', label: 'Rejected', color: '#f87171' },
    { value: 'selected', label: 'Selected', color: '#34d399' },
    { value: 'offer', label: 'Offer Received', color: '#a78bfa' }
  ];

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editingJob ? 'Edit Application' : 'Add New Application'}</h2>
          <button onClick={onCancel} className="btn-icon">
            <X size={22} />
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="job-form">
          <div className="form-grid">
            {/* Company Name */}
            <div className="form-group">
              <label><Building2 size={16} /> Company Name *</label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                placeholder="e.g., SSGC, Google, Microsoft"
                required
              />
            </div>

            {/* Job Title */}
            <div className="form-group">
              <label><FileText size={16} /> Job Title *</label>
              <input
                type="text"
                name="job_title"
                value={formData.job_title}
                onChange={handleChange}
                placeholder="e.g., Software Engineer"
                required
              />
            </div>

            {/* Location */}
            <div className="form-group">
              <label><MapPin size={16} /> Location</label>
              <input
                type="text"
                name="job_location"
                value={formData.job_location}
                onChange={handleChange}
                placeholder="e.g., Lahore, Remote"
              />
            </div>

            {/* Salary Range */}
            <div className="form-group">
              <label><DollarSign size={16} /> Salary Range</label>
              <input
                type="text"
                name="salary_range"
                value={formData.salary_range}
                onChange={handleChange}
                placeholder="e.g., 80,000 - 120,000"
              />
            </div>

            {/* Application Date */}
            <div className="form-group">
              <label><Calendar size={16} /> Application Date *</label>
              <input
                type="date"
                name="application_date"
                value={formData.application_date}
                onChange={handleChange}
                required
              />
            </div>

            {/* Status */}
            <div className="form-group">
              <label><Tag size={16} /> Status</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                {statusOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Job URL */}
            <div className="form-group">
              <label><Link size={16} /> Job URL</label>
              <input
                type="url"
                name="job_url"
                value={formData.job_url}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>

            {/* Contact Person */}
            <div className="form-group">
              <label><User size={16} /> Contact Person</label>
              <input
                type="text"
                name="contact_person"
                value={formData.contact_person}
                onChange={handleChange}
                placeholder="HR Name"
              />
            </div>

            {/* Contact Email */}
            <div className="form-group">
              <label><Mail size={16} /> Contact Email</label>
              <input
                type="email"
                name="contact_email"
                value={formData.contact_email}
                onChange={handleChange}
                placeholder="hr@company.com"
              />
            </div>
          </div>

          {/* Job Description */}
          <div className="form-group">
            <label><FileText size={16} /> Job Description</label>
            <textarea
              name="job_description"
              value={formData.job_description}
              onChange={handleChange}
              placeholder="Paste job description or key requirements..."
              rows={3}
            />
          </div>

          {/* Notes */}
          <div className="form-group">
            <label><StickyNote size={16} /> Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Your notes about this application..."
              rows={3}
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : editingJob ? 'Update Application' : 'Add Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobForm;
