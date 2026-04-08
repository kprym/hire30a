const http = require('http');
const fs = require('fs/promises');
const path = require('path');
const { URL } = require('url');

const PORT = process.env.PORT || 3000;
const rootDir = __dirname;
const dataDir = path.join(rootDir, 'data');
const publicDir = path.join(rootDir, 'public');
const jobsPath = path.join(dataDir, 'jobs.json');
const applicationsPath = path.join(dataDir, 'applications.json');

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function normalize(value) {
  return String(value || '').trim().toLowerCase();
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, 'utf-8'));
}

async function writeJson(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': contentTypes['.json'] });
  res.end(JSON.stringify(data));
}

async function parseBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }

  if (!chunks.length) return {};

  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf-8'));
  } catch {
    return null;
  }
}

async function handleApi(req, res, url) {
  if (req.method === 'GET' && url.pathname === '/api/jobs') {
    const jobs = await readJson(jobsPath);
    const q = normalize(url.searchParams.get('q'));
    const type = normalize(url.searchParams.get('type'));
    const category = normalize(url.searchParams.get('category'));

    const filtered = jobs
      .filter((job) => {
        const matchesText =
          !q || [job.title, job.company, job.location, job.description].join(' ').toLowerCase().includes(q);
        const matchesType = !type || normalize(job.type) === type;
        const matchesCategory = !category || normalize(job.category) === category;
        return matchesText && matchesType && matchesCategory;
      })
      .sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));

    return sendJson(res, 200, filtered);
  }

  if (req.method === 'GET' && url.pathname === '/api/stats') {
    const [jobs, applications] = await Promise.all([readJson(jobsPath), readJson(applicationsPath)]);
    return sendJson(res, 200, {
      totalJobs: jobs.length,
      totalApplications: applications.length,
      localCompanies: new Set(jobs.map((job) => job.company)).size
    });
  }

  if (req.method === 'POST' && url.pathname === '/api/jobs') {
    const body = await parseBody(req);
    if (!body) return sendJson(res, 400, { message: 'Invalid JSON body.' });

    const { title, company, location, type, category, salary, description } = body;
    if (!title || !company || !location || !type || !category || !description) {
      return sendJson(res, 400, {
        message: 'Please provide title, company, location, type, category, and description.'
      });
    }

    const jobs = await readJson(jobsPath);
    const newJob = {
      id: `job-${Date.now()}`,
      title: title.trim(),
      company: company.trim(),
      location: location.trim(),
      type: type.trim(),
      category: category.trim(),
      salary: (salary || 'Compensation discussed during interview').trim(),
      description: description.trim(),
      postedAt: new Date().toISOString()
    };

    jobs.push(newJob);
    await writeJson(jobsPath, jobs);
    return sendJson(res, 201, newJob);
  }

  const applyMatch = req.method === 'POST' && url.pathname.match(/^\/api\/jobs\/([^/]+)\/apply$/);
  if (applyMatch) {
    const jobId = applyMatch[1];
    const body = await parseBody(req);
    if (!body) return sendJson(res, 400, { message: 'Invalid JSON body.' });

    const { name, email, phone, message } = body;
    if (!name || !email) {
      return sendJson(res, 400, { message: 'Name and email are required to apply.' });
    }

    const jobs = await readJson(jobsPath);
    const job = jobs.find((item) => item.id === jobId);
    if (!job) {
      return sendJson(res, 404, { message: 'Job not found.' });
    }

    const applications = await readJson(applicationsPath);
    applications.push({
      id: `app-${Date.now()}`,
      jobId,
      jobTitle: job.title,
      company: job.company,
      name: name.trim(),
      email: email.trim(),
      phone: (phone || '').trim(),
      message: (message || '').trim(),
      submittedAt: new Date().toISOString()
    });

    await writeJson(applicationsPath, applications);
    return sendJson(res, 201, { message: `Application submitted for ${job.title} at ${job.company}.` });
  }

  return sendJson(res, 404, { message: 'Endpoint not found.' });
}

async function serveStatic(req, res, url) {
  let requestedPath = url.pathname === '/' ? '/index.html' : url.pathname;
  requestedPath = path.normalize(requestedPath).replace(/^\.\.(\/|\\|$)+/, '');

  const filePath = path.join(publicDir, requestedPath);

  try {
    const stat = await fs.stat(filePath);
    if (stat.isDirectory()) {
      throw new Error('Directory not supported');
    }

    const ext = path.extname(filePath).toLowerCase();
    const content = await fs.readFile(filePath);
    res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'application/octet-stream' });
    res.end(content);
  } catch {
    const fallback = await fs.readFile(path.join(publicDir, 'index.html'));
    res.writeHead(200, { 'Content-Type': contentTypes['.html'] });
    res.end(fallback);
  }
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (url.pathname.startsWith('/api/')) {
      await handleApi(req, res, url);
    } else {
      await serveStatic(req, res, url);
    }
  } catch (error) {
    sendJson(res, 500, { message: 'Internal server error.' });
  }
});

server.listen(PORT, () => {
  console.log(`Hire30A is running on http://localhost:${PORT}`);
});
