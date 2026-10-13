const express = require('express');
const router = express.Router();
const {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  getStats
} = require('../controllers/jobController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Stats route (before :id route)
router.get('/stats', getStats);

// CRUD routes
router.route('/')
  .get(getJobs)
  .post(createJob);

router.route('/:id')
  .get(getJob)
  .put(updateJob)
  .delete(deleteJob);

module.exports = router;
