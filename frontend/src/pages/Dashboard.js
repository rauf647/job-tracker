import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import StatsCards from '../components/StatsCards';
import JobFilters from '../components/JobFilters';
import JobCard from '../components/JobCard';
import JobForm from '../components/JobForm';
import { Plus, Inbox, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    sort: 'newest',
    page: 1,
    limit: 9
  });

  // Fetch jobs
  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await api.get(`/jobs?${params}`);
      setJobs(response.data.jobs);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await api.get('/jobs/stats');
      setStats(response.data.stats);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
    fetchStats();
  }, [fetchJobs, fetchStats]);

  const handleAddJob = () => {
    setEditingJob(null);
    setShowForm(true);
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setShowForm(true);
  };

  const handleDeleteJob = async (jobId) => {
    try {
      await api.delete(`/jobs/${jobId}`);
      fetchJobs();
      fetchStats();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingJob(null);
    fetchJobs();
    fetchStats();
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="dashboard-page">
      <Navbar onAddJob={handleAddJob} />

      <main className="main-content">
        {/* Stats Section */}
        <section className="stats-section">
          <StatsCards stats={stats} />
        </section>

        {/* Filters Section */}
        <section className="filters-section">
          <div className="section-header">
            <h2>My Applications</h2>
            <button onClick={handleAddJob} className="btn btn-primary">
              <Plus size={18} /> Add New
            </button>
          </div>
          <JobFilters filters={filters} onFilterChange={setFilters} />
        </section>

        {/* Jobs Grid */}
        <section className="jobs-section">
          {loading ? (
            <div className="loading-container">
              <Loader2 size={40} className="spinner" />
              <p>Loading applications...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="empty-state">
              <Inbox size={48} className="empty-icon" />
              <h3>No applications found</h3>
              <p>
                {filters.search || filters.status !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Start by adding your first job application'}
              </p>
              {!filters.search && filters.status === 'all' && (
                <button onClick={handleAddJob} className="btn btn-primary">
                  <Plus size={18} /> Add Your First Application
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="jobs-grid">
                {jobs.map(job => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onEdit={handleEditJob}
                    onDelete={handleDeleteJob}
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="btn btn-secondary btn-sm"
                  >
                    <ChevronLeft size={18} /> Previous
                  </button>
                  <span className="page-info">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="btn btn-secondary btn-sm"
                  >
                    Next <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      {/* Job Form Modal */}
      {showForm && (
        <JobForm
          editingJob={editingJob}
          onSuccess={handleFormSuccess}
          onCancel={() => { setShowForm(false); setEditingJob(null); }}
        />
      )}
    </div>
  );
};

export default Dashboard;
