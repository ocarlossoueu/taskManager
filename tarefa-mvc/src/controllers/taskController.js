const { readTasks, writeTasks, readUsers } = require('../models/taskModel');

function jsonResponse(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

async function listUsers(req, res) {
  const users = await readUsers();
  jsonResponse(res, 200, users);
}

async function listTasks(req, res) {
  const tasks = await readTasks();
  jsonResponse(res, 200, tasks);
}

async function createTask(req, res, body) {
  const tasks = await readTasks();
  const nextId = tasks.length ? Math.max(...tasks.map((task) => task.id)) + 1 : 1;

  const task = {
    id: nextId,
    responsavel: body.responsavel,
    tarefaPrincipal: body.tarefaPrincipal,
    subtasks: Array.isArray(body.subtasks) ? body.subtasks : [],
    dataInicio: new Date().toISOString(),
    dataFinalizacao: null,
    status: 'aberta',
  };

  tasks.push(task);
  await writeTasks(tasks);

  jsonResponse(res, 201, task);
}

async function updateTask(req, res, taskId, body) {
  const tasks = await readTasks();
  const index = tasks.findIndex((task) => task.id === taskId);

  if (index === -1) return jsonResponse(res, 404, { message: 'Tarefa não encontrada.' });

  tasks[index] = {
    ...tasks[index],
    responsavel: body.responsavel,
    tarefaPrincipal: body.tarefaPrincipal,
    subtasks: Array.isArray(body.subtasks) ? body.subtasks : [],
  };

  await writeTasks(tasks);
  jsonResponse(res, 200, tasks[index]);
}

async function deleteTask(req, res, taskId) {
  const tasks = await readTasks();
  const filtered = tasks.filter((task) => task.id !== taskId);

  if (filtered.length === tasks.length) {
    return jsonResponse(res, 404, { message: 'Tarefa não encontrada.' });
  }

  await writeTasks(filtered);
  jsonResponse(res, 200, { message: 'Tarefa removida com sucesso.' });
}

async function finalizeTask(req, res, taskId) {
  const tasks = await readTasks();
  const index = tasks.findIndex((task) => task.id === taskId);

  if (index === -1) return jsonResponse(res, 404, { message: 'Tarefa não encontrada.' });

  tasks[index] = {
    ...tasks[index],
    dataFinalizacao: new Date().toISOString(),
    status: 'finalizada',
  };

  await writeTasks(tasks);
  jsonResponse(res, 200, tasks[index]);
}

module.exports = {
  listUsers,
  listTasks,
  createTask,
  updateTask,
  deleteTask,
  finalizeTask,
};
