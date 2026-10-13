const bcrypt = require('bcryptjs');
const { pool, initDatabase } = require('./config/db');

async function seed() {
  try {
    await initDatabase();

    // Create demo user
    const hashedPassword = await bcrypt.hash('demo123', 10);

    // Check if demo user already exists
    const [existing] = await pool.execute('SELECT id FROM users WHERE email = ?', ['demo@jobtracker.com']);

    let userId;
    if (existing.length > 0) {
      userId = existing[0].id;
      // Clear existing jobs for clean seed
      await pool.execute('DELETE FROM job_applications WHERE user_id = ?', [userId]);
      console.log('🔄 Cleared existing demo jobs');
    } else {
      const [result] = await pool.execute(
        'INSERT INTO users (name, email, password, phone, location, bio) VALUES (?, ?, ?, ?, ?, ?)',
        ['Ahmad Khan', 'demo@jobtracker.com', hashedPassword, '+92 300 1234567', 'Lahore, Pakistan', 'Full-stack developer passionate about building great products']
      );
      userId = result.insertId;
      console.log('✅ Demo user created');
    }

    // 12 Sample job applications
    const jobs = [
      {
        company_name: 'SSGC',
        job_title: 'Software Engineer',
        job_description: 'Develop and maintain gas pipeline monitoring systems using modern web technologies.',
        job_location: 'Karachi, Pakistan',
        salary_range: '120,000 - 180,000 PKR',
        application_date: '2026-09-15',
        status: 'interview',
        notes: 'First round cleared. Technical interview scheduled next week.',
        job_url: 'https://ssgc.com.pk/careers',
        contact_person: 'Mr. Ahmed',
        contact_email: 'hr@ssgc.com.pk'
      },
      {
        company_name: 'Systems Limited',
        job_title: 'React Developer',
        job_description: 'Build enterprise-grade web applications using React, TypeScript, and Node.js.',
        job_location: 'Lahore, Pakistan',
        salary_range: '150,000 - 220,000 PKR',
        application_date: '2026-09-20',
        status: 'applied',
        notes: 'Applied through company portal. Waiting for response.',
        job_url: 'https://systemslimited.com/careers',
        contact_person: 'HR Team',
        contact_email: 'careers@systemslimited.com'
      },
      {
        company_name: '10Pearls',
        job_title: 'Full Stack Developer',
        job_description: 'Work on international client projects using MERN stack and cloud services.',
        job_location: 'Islamabad, Pakistan',
        salary_range: '180,000 - 250,000 PKR',
        application_date: '2026-08-10',
        status: 'selected',
        notes: 'Got the offer letter! Joining from next month.',
        job_url: 'https://10pearls.com/careers',
        contact_person: 'Sarah Khan',
        contact_email: 'sarah@10pearls.com'
      },
      {
        company_name: 'Arbisoft',
        job_title: 'Frontend Engineer',
        job_description: 'Develop scalable frontend solutions for US-based clients in ed-tech domain.',
        job_location: 'Lahore, Pakistan (Remote)',
        salary_range: '200,000 - 300,000 PKR',
        application_date: '2026-09-05',
        status: 'offer',
        notes: 'Offer received. Negotiating salary package.',
        job_url: 'https://arbisoft.com/careers',
        contact_person: 'Talent Team',
        contact_email: 'talent@arbisoft.com'
      },
      {
        company_name: 'NetSol Technologies',
        job_title: 'Junior Software Developer',
        job_description: 'Work on automotive leasing software solutions for international markets.',
        job_location: 'Lahore, Pakistan',
        salary_range: '80,000 - 120,000 PKR',
        application_date: '2026-07-22',
        status: 'rejected',
        notes: 'Did not pass the coding test. Need to improve DSA skills.',
        job_url: 'https://netsoltech.com/careers',
        contact_person: null,
        contact_email: null
      },
      {
        company_name: 'Tkxel',
        job_title: 'Associate Software Engineer',
        job_description: 'Develop modern web applications for Fortune 500 clients.',
        job_location: 'Lahore, Pakistan',
        salary_range: '100,000 - 160,000 PKR',
        application_date: '2026-09-28',
        status: 'applied',
        notes: 'Applied via LinkedIn. Profile looked good.',
        job_url: 'https://tkxel.com/careers',
        contact_person: 'Recruitment Team',
        contact_email: 'jobs@tkxel.com'
      },
      {
        company_name: 'Ciklum',
        job_title: 'JavaScript Developer',
        job_description: 'Join international agile team building fintech products.',
        job_location: 'Remote (Pakistan)',
        salary_range: '3,000 - 5,000 USD/month',
        application_date: '2026-09-01',
        status: 'interview',
        notes: 'Technical interview done. Waiting for client interview.',
        job_url: 'https://ciklum.com/careers',
        contact_person: 'Anna Petrova',
        contact_email: 'anna@ciklum.com'
      },
      {
        company_name: 'Devsinc',
        job_title: 'MERN Stack Developer',
        job_description: 'Build full-stack applications for US healthcare startups.',
        job_location: 'Lahore, Pakistan',
        salary_range: '160,000 - 240,000 PKR',
        application_date: '2026-08-15',
        status: 'rejected',
        notes: 'Went well but they chose a more experienced candidate.',
        job_url: 'https://devsinc.com/careers',
        contact_person: null,
        contact_email: null
      },
      {
        company_name: 'ByteWise',
        job_title: 'Software Developer',
        job_description: 'Develop AI-powered solutions for logistics companies.',
        job_location: 'Islamabad, Pakistan',
        salary_range: '140,000 - 200,000 PKR',
        application_date: '2026-09-12',
        status: 'applied',
        notes: 'Just applied. Company looks promising.',
        job_url: 'https://bytewise.com/careers',
        contact_person: 'HR',
        contact_email: 'hr@bytewise.com'
      },
      {
        company_name: 'Contour Software',
        job_title: 'Web Application Developer',
        job_description: 'Work on visa management software used by embassies worldwide.',
        job_location: 'Islamabad, Pakistan',
        salary_range: '90,000 - 140,000 PKR',
        application_date: '2026-07-30',
        status: 'selected',
        notes: 'Joined last month. Great team and work environment!',
        job_url: 'https://contoursoftware.com/careers',
        contact_person: 'Manager',
        contact_email: 'jobs@contoursoftware.com'
      },
      {
        company_name: 'Techlogix',
        job_title: 'Senior Frontend Developer',
        job_description: 'Lead frontend architecture for financial trading platforms.',
        job_location: 'Lahore, Pakistan',
        salary_range: '250,000 - 350,000 PKR',
        application_date: '2026-09-25',
        status: 'applied',
        notes: 'Dream company. Applied through referral.',
        job_url: 'https://techlogix.com/careers',
        contact_person: 'Referral by Ali',
        contact_email: 'careers@techlogix.com'
      },
      {
        company_name: 'S&P Global',
        job_title: 'Software Engineer II',
        job_description: 'Build data visualization tools for financial analysts.',
        job_location: 'Lahore, Pakistan (Hybrid)',
        salary_range: '400,000 - 600,000 PKR',
        application_date: '2026-09-30',
        status: 'applied',
        notes: 'Just submitted application. Fingers crossed!',
        job_url: 'https://spglobal.com/careers',
        contact_person: null,
        contact_email: null
      }
    ];

    for (const job of jobs) {
      await pool.execute(
        `INSERT INTO job_applications
         (user_id, company_name, job_title, job_description, job_location,
          salary_range, application_date, status, notes, job_url,
          contact_person, contact_email)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          job.company_name,
          job.job_title,
          job.job_description,
          job.job_location,
          job.salary_range,
          job.application_date,
          job.status,
          job.notes,
          job.job_url,
          job.contact_person,
          job.contact_email
        ]
      );
    }

    console.log(`✅ ${jobs.length} job applications seeded`);
    console.log('');
    console.log('=================================');
    console.log('  DEMO LOGIN CREDENTIALS');
    console.log('=================================');
    console.log('  Email:    demo@jobtracker.com');
    console.log('  Password: demo123');
    console.log('=================================');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seed();
