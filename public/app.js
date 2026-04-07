const form = document.getElementById('task-form');
const idInput = document.getElementById('task-id');
const responsavelSelect = document.getElementById('responsavel');
const tarefaPrincipalInput = document.getElementById('tarefaPrincipal');
const subtasksInput = document.getElementById('subtasks');
const taskList = document.getElementById('task-list');

const btnSalvar = document.getElementById('btn-salvar');
const btnCancelar = document.getElementById('btn-cancelar');

function formatDate(value) {
  if (!value) return '-';
  return new Date(value).toLocaleString('pt-BR');
}

function parseSubtasks(value) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function clearForm() {
  idInput.value = '';
  tarefaPrincipalInput.value = '';
  subtasksInput.value = '';
  responsavelSelect.selectedIndex = 0;
}

async function loadUsers() {
  const response = await fetch('/api/users');
  const users = await response.json();

  responsavelSelect.innerHTML = users
    .map((name) => `<option value="${name}">${name}</option>`)
    .join('');
}

function renderTasks(tasks) {
  taskList.innerHTML = tasks
    .map(
      (task) => `
      <tr>
        <td>${task.id}</td>
        <td>${task.responsavel}</td>
        <td>${task.tarefaPrincipal}</td>
        <td>${task.subtasks.join(', ') || '-'}</td>
        <td class="small">${formatDate(task.dataInicio)}</td>
        <td class="small">${formatDate(task.dataFinalizacao)}</td>
        <td>${task.status}</td>
        <td>
          <button class="btn-edit" data-edit="${task.id}">Salvar</button>
          <button class="btn-delete" data-delete="${task.id}">Deletar</button>
          <button class="btn-finish" data-finish="${task.id}">Finalizar tarefa</button>
        </td>
      </tr>`
    )
    .join('');
}

async function loadTasks() {
  const response = await fetch('/api/tasks');
  const tasks = await response.json();
  renderTasks(tasks);
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const payload = {
    responsavel: responsavelSelect.value,
    tarefaPrincipal: tarefaPrincipalInput.value,
    subtasks: parseSubtasks(subtasksInput.value),
  };

  await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  clearForm();
  loadTasks();
});

btnSalvar.addEventListener('click', async () => {
  if (!idInput.value) {
    alert('Selecione uma tarefa para salvar as alterações.');
    return;
  }

  const payload = {
    responsavel: responsavelSelect.value,
    tarefaPrincipal: tarefaPrincipalInput.value,
    subtasks: parseSubtasks(subtasksInput.value),
  };

  await fetch(`/api/tasks/${idInput.value}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  clearForm();
  loadTasks();
});

btnCancelar.addEventListener('click', clearForm);

taskList.addEventListener('click', async (event) => {
  const editId = event.target.dataset.edit;
  const deleteId = event.target.dataset.delete;
  const finishId = event.target.dataset.finish;

  if (editId) {
    const response = await fetch('/api/tasks');
    const tasks = await response.json();
    const task = tasks.find((item) => item.id === Number(editId));

    if (!task) return;

    idInput.value = task.id;
    responsavelSelect.value = task.responsavel;
    tarefaPrincipalInput.value = task.tarefaPrincipal;
    subtasksInput.value = task.subtasks.join(', ');
  }

  if (deleteId) {
    await fetch(`/api/tasks/${deleteId}`, { method: 'DELETE' });
    loadTasks();
  }

  if (finishId) {
    await fetch(`/api/tasks/${finishId}/finalize`, { method: 'POST' });
    loadTasks();
  }
});

loadUsers();
loadTasks();
