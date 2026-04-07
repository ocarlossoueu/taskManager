const fs = require('fs/promises');
const path = require('path');

const tasksFilePath = path.join(__dirname, '..', '..', 'data', 'tasks.txt');
const usersFilePath = path.join(__dirname, '..', '..', 'data', 'users.txt');

async function readTasks() {
  try {
    const raw = await fs.readFile(tasksFilePath, 'utf-8');
    return JSON.parse(raw || '[]');
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

async function writeTasks(tasks) {
  await fs.writeFile(tasksFilePath, JSON.stringify(tasks, null, 2), 'utf-8');
}

async function readUsers() {
  try {
    const raw = await fs.readFile(usersFilePath, 'utf-8');
    return raw
      .split(/\r?\n/)
      .map((user) => user.trim())
      .filter(Boolean);
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

module.exports = {
  readTasks,
  writeTasks,
  readUsers,
};
