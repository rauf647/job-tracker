const { pool } = require('../config/db');

// @desc    Get all job applications for logged-in user
// @route   GET /api/jobs
// @query   status, company, search, sort, page, limit
exports.getJobs = async (req, res) => {
  try {
    const { status, company, search, sort = 'newest', page = 1, limit = 10 } = req.query;
    const userId = req.user.id;

    let query = 'SELECT * FROM job_applications WHERE user_id = ?';
    const params = [userId];

    // Filter by status
    if (status && status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }

    // Filter by company name
    if (company) {
      query += ' AND company_name LIKE ?';
      params.push(`%${company}%`);
    }

    // Search in title, company, notes
    if (search) {
      query += ' AND (job_title LIKE ? OR company_name LIKE ? OR notes LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    // Sorting
    switch (sort) {
      case 'oldest':
        query += ' ORDER BY application_date ASC';
        break;
      case 'company':
        query += ' ORDER BY company_name ASC';
        break;
      case 'title':
        query += ' ORDER BY job_title ASC';
        break;
      case 'status':
        query += " ORDER BY CASE status WHEN 'applied' THEN 1 WHEN 'interview' THEN 2 WHEN 'offer' THEN 3 WHEN 'selected' THEN 4 WHEN 'rejected' THEN 5 ELSE 6 END";
        break;
      default:
        query += ' ORDER BY application_date DESC';
    }

    // Pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [jobs] = await pool.execute(query, params);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM job_applications WHERE user_id = ?';
    const countParams = [userId];

    if (status && status !== 'all') {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }
    if (company) {
      countQuery += ' AND company_name LIKE ?';
      countParams.push(`%${company}%`);
    }
    if (search) {
      countQuery += ' AND (job_title LIKE ? OR company_name LIKE ? OR notes LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const [countResult] = await pool.execute(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      success: true,
      jobs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('GetJobs error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single job application
// @route   GET /api/jobs/:id
exports.getJob = async (req, res) => {
  try {
    const [jobs] = await pool.execute(
      'SELECT * FROM job_applications WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (jobs.length === 0) {
      return res.status(404).json({ message: 'Job application not found' });
    }

    res.json({ success: true, job: jobs[0] });
  } catch (error) {
    console.error('GetJob error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create new job application
// @route   POST /api/jobs
exports.createJob = async (req, res) => {
  try {
    const {
      company_name,
      job_title,
      job_description,
      job_location,
      salary_range,
      application_date,
      status,
      notes,
      job_url,
      contact_person,
      contact_email
    } = req.body;

    // Validation
    if (!company_name || !job_title || !application_date) {
      return res.status(400).json({
        message: 'Please provide company name, job title, and application date'
      });
    }

    const [result] = await pool.execute(
      `INSERT INTO job_applications
       (user_id, company_name, job_title, job_description, job_location,
        salary_range, application_date, status, notes, job_url,
        contact_person, contact_email)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        company_name,
        job_title,
        job_description || null,
        job_location || null,
        salary_range || null,
        application_date,
        status || 'applied',
        notes || null,
        job_url || null,
        contact_person || null,
        contact_email || null
      ]
    );

    const [newJob] = await pool.execute(
      'SELECT * FROM job_applications WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({ success: true, job: newJob[0] });
  } catch (error) {
    console.error('CreateJob error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update job application
// @route   PUT /api/jobs/:id
exports.updateJob = async (req, res) => {
  try {
    const {
      company_name,
      job_title,
      job_description,
      job_location,
      salary_range,
      application_date,
      status,
      notes,
      job_url,
      contact_person,
      contact_email
    } = req.body;

    // Check if job exists and belongs to user
    const [existing] = await pool.execute(
      'SELECT id FROM job_applications WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: 'Job application not found' });
    }

    await pool.execute(
      `UPDATE job_applications SET
        company_name = ?, job_title = ?, job_description = ?,
        job_location = ?, salary_range = ?, application_date = ?,
        status = ?, notes = ?, job_url = ?, contact_person = ?,
        contact_email = ?
       WHERE id = ? AND user_id = ?`,
      [
        company_name,
        job_title,
        job_description || null,
        job_location || null,
        salary_range || null,
        application_date,
        status || 'applied',
        notes || null,
        job_url || null,
        contact_person || null,
        contact_email || null,
        req.params.id,
        req.user.id
      ]
    );

    const [updatedJob] = await pool.execute(
      'SELECT * FROM job_applications WHERE id = ?',
      [req.params.id]
    );

    res.json({ success: true, job: updatedJob[0] });
  } catch (error) {
    console.error('UpdateJob error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete job application
// @route   DELETE /api/jobs/:id
exports.deleteJob = async (req, res) => {
  try {
    const [result] = await pool.execute(
      'DELETE FROM job_applications WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Job application not found' });
    }

    res.json({ success: true, message: 'Job application deleted successfully' });
  } catch (error) {
    console.error('DeleteJob error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/jobs/stats
exports.getStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Count by status
    const [statusCounts] = await pool.execute(
      `SELECT status, COUNT(*) as count
       FROM job_applications
       WHERE user_id = ?
       GROUP BY status`,
      [userId]
    );

    // Total applications
    const [totalResult] = await pool.execute(
      'SELECT COUNT(*) as total FROM job_applications WHERE user_id = ?',
      [userId]
    );

    // Applications this month
    const [monthResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM job_applications
       WHERE user_id = ? AND strftime('%m', application_date) = strftime('%m', 'now')
       AND strftime('%Y', application_date) = strftime('%Y', 'now')`,
      [userId]
    );

    // Recent applications
    const [recent] = await pool.execute(
      `SELECT * FROM job_applications
       WHERE user_id = ? ORDER BY created_at DESC LIMIT 5`,
      [userId]
    );

    // Format status counts
    const stats = {
      applied: 0,
      interview: 0,
      rejected: 0,
      selected: 0,
      offer: 0
    };

    statusCounts.forEach(row => {
      stats[row.status] = row.count;
    });

    res.json({
      success: true,
      stats: {
        ...stats,
        total: totalResult[0].total,
        thisMonth: monthResult[0].total,
        recent
      }
    });
  } catch (error) {
    console.error('GetStats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
