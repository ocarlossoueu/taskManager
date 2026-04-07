const http = require('http');
const {
  listUsers,
  listTasks,
  createTask,
  updateTask,
  deleteTask,
  finalizeTask,
} = require('./src/controllers/taskController');
const { serveStatic } = require('./src/views/taskView');

const PORT = 3000;

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';

    req.on('data', (chunk) => {
      data += chunk;
    });

    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        reject(new Error('JSON inválido'));
      }
    });

    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.url === '/api/users' && req.method === 'GET') return listUsers(req, res);
    if (req.url === '/api/tasks' && req.method === 'GET') return listTasks(req, res);

    if (req.url === '/api/tasks' && req.method === 'POST') {
      const body = await readBody(req);
      return createTask(req, res, body);
    }

    const updateMatch = req.url.match(/^\/api\/tasks\/(\d+)$/);
    if (updateMatch && req.method === 'PUT') {
      const body = await readBody(req);
      return updateTask(req, res, Number(updateMatch[1]), body);
    }

    if (updateMatch && req.method === 'DELETE') {
      return deleteTask(req, res, Number(updateMatch[1]));
    }

    const finalizeMatch = req.url.match(/^\/api\/tasks\/(\d+)\/finalize$/);
    if (finalizeMatch && req.method === 'POST') {
      return finalizeTask(req, res, Number(finalizeMatch[1]));
    }

    return serveStatic(req, res);
  } catch (error) {
    res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ message: error.message }));
  }
});

server.listen(PORT, () => {
  console.log(`Servidor em execução: http://localhost:${PORT}`);
});
