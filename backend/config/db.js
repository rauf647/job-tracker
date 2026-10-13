const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data.sqlite');

// Create SQLite database connection (built-in node:sqlite, no native compilation needed)
const db = new DatabaseSync(DB_PATH);

// Initialize database tables
function initDatabase() {
  return new Promise((resolve, reject) => {
  try {
    // Users table
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phone TEXT,
        location TEXT,
        bio TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      )
    `);

    // Job applications table
    db.exec(`
      CREATE TABLE IF NOT EXISTS job_applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        company_name TEXT NOT NULL,
        job_title TEXT NOT NULL,
        job_description TEXT,
        job_location TEXT,
        salary_range TEXT,
        application_date TEXT NOT NULL,
        status TEXT DEFAULT 'applied' CHECK(status IN ('applied', 'interview', 'rejected', 'selected', 'offer')),
        notes TEXT,
        job_url TEXT,
        contact_person TEXT,
        contact_email TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create indexes
    db.exec(`CREATE INDEX IF NOT EXISTS idx_job_user_status ON job_applications(user_id, status)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_job_user_date ON job_applications(user_id, application_date)`);

    // Trigger to update updated_at timestamp
    db.exec(`
      CREATE TRIGGER IF NOT EXISTS users_updated_at
      AFTER UPDATE ON users
      FOR EACH ROW
      BEGIN
        UPDATE users SET updated_at = datetime('now') WHERE id = OLD.id;
      END
    `);

    db.exec(`
      CREATE TRIGGER IF NOT EXISTS jobs_updated_at
      AFTER UPDATE ON job_applications
      FOR EACH ROW
      BEGIN
        UPDATE job_applications SET updated_at = datetime('now') WHERE id = OLD.id;
      END
    `);

    console.log('✅ Database initialized successfully');
    resolve();
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    reject(error);
  }
  });
}

// Pool wrapper that mimics mysql2's pool.execute() interface
// Returns [rows] for SELECT, [{ insertId }] for INSERT, [{ affectedRows }] for UPDATE/DELETE
const pool = {
  execute(sql, params = []) {
    try {
      const trimmedSql = sql.trim().toUpperCase();

      if (trimmedSql.startsWith('SELECT') || trimmedSql.startsWith('PRAGMA')) {
        const stmt = db.prepare(sql);
        const rows = stmt.all(...params);
        return Promise.resolve([rows]);
      }

      if (trimmedSql.startsWith('INSERT')) {
        const stmt = db.prepare(sql);
        const info = stmt.run(...params);
        return Promise.resolve([{ insertId: Number(info.lastInsertRowid) }]);
      }

      // UPDATE, DELETE, CREATE, ALTER, DROP, etc.
      const stmt = db.prepare(sql);
      const info = stmt.run(...params);
      return Promise.resolve([{ affectedRows: info.changes }]);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  query(sql, params = []) {
    return this.execute(sql, params);
  }
};

module.exports = { pool, initDatabase };
