// ── Constantes ────────────────────────────────────────────────────────────
const STORAGE_KEY    = 'taskManager_tarefas';
const PLACEHOLDER_RS = ''; // valor do option padrão do select de responsável

// ── Referências ao DOM ────────────────────────────────────────────────────
const idInput              = document.getElementById('task-id');
const responsavelSelect    = document.getElementById('responsavel');
const tarefaPrincipalInput = document.getElementById('tarefaPrincipal');
const prioridadeSelect     = document.getElementById('prioridade');
const descricaoInput       = document.getElementById('descricao');
const charCount            = document.getElementById('char-count');
const taskList             = document.getElementById('task-list');
const feedbackEl           = document.getElementById('feedback');
const formTitle            = document.getElementById('form-title');
const contador             = document.getElementById('contador');

const btnCriar    = document.getElementById('btn-criar');
const btnSalvar   = document.getElementById('btn-salvar');
const btnCancelar = document.getElementById('btn-cancelar');

const errorResponsavel     = document.getElementById('error-responsavel');
const errorTarefaPrincipal = document.getElementById('error-tarefaPrincipal');
const errorPrioridade      = document.getElementById('error-prioridade');

const botoesFiltro = document.querySelectorAll('.btn-filtro');

// ── Estado ────────────────────────────────────────────────────────────────
let filtroAtivo   = 'todas';
let feedbackTimer = null;

// ── Persistência (localStorage) ───────────────────────────────────────────

function carregarTarefas() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function salvarTarefas(tarefas) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tarefas));
}

function proximoId(tarefas) {
  if (!tarefas.length) return 1;
  return Math.max(...tarefas.map((t) => t.id)) + 1;
}

// ── Feedback ──────────────────────────────────────────────────────────────

function showFeedback(mensagem, tipo = 'success') {
  if (feedbackTimer) clearTimeout(feedbackTimer);

  feedbackEl.textContent = (tipo === 'success' ? '✔ ' : '✖ ') + mensagem;
  feedbackEl.className   = `feedback ${tipo}`;

  feedbackTimer = setTimeout(() => {
    feedbackEl.className = 'feedback hidden';
  }, 4000);
}

// ── Validação ─────────────────────────────────────────────────────────────

function limparErrosCampos() {
  responsavelSelect.classList.remove('invalid');
  tarefaPrincipalInput.classList.remove('invalid');
  prioridadeSelect.classList.remove('invalid');
  errorResponsavel.textContent     = '';
  errorTarefaPrincipal.textContent = '';
  errorPrioridade.textContent      = '';
}

function validarFormulario() {
  limparErrosCampos();
  let valido = true;

  if (!responsavelSelect.value) {
    responsavelSelect.classList.add('invalid');
    errorResponsavel.textContent = 'Selecione um responsável.';
    valido = false;
  }

  if (!tarefaPrincipalInput.value.trim()) {
    tarefaPrincipalInput.classList.add('invalid');
    errorTarefaPrincipal.textContent = 'O campo "Tarefa Principal" é obrigatório.';
    valido = false;
  }

  if (!prioridadeSelect.value) {
    prioridadeSelect.classList.add('invalid');
    errorPrioridade.textContent = 'Selecione a prioridade.';
    valido = false;
  }

  return valido;
}

// ── Formulário ────────────────────────────────────────────────────────────

function limparFormulario() {
  idInput.value                 = '';
  responsavelSelect.value       = '';
  tarefaPrincipalInput.value    = '';
  prioridadeSelect.value        = '';
  descricaoInput.value          = '';
  charCount.textContent         = '0 / 300';
  formTitle.textContent         = 'Nova Tarefa';

  limparErrosCampos();

  btnCriar.style.display    = 'inline-block';
  btnSalvar.style.display   = 'none';
  btnCancelar.style.display = 'none';
}

function modoEdicao(tarefa) {
  idInput.value                 = tarefa.id;
  responsavelSelect.value       = tarefa.responsavel;
  tarefaPrincipalInput.value    = tarefa.tarefaPrincipal;
  prioridadeSelect.value        = tarefa.prioridade;
  descricaoInput.value          = tarefa.descricao || '';
  charCount.textContent         = `${(tarefa.descricao || '').length} / 300`;
  formTitle.textContent         = 'Editar Tarefa';

  limparErrosCampos();

  btnCriar.style.display    = 'none';
  btnSalvar.style.display   = 'inline-block';
  btnCancelar.style.display = 'inline-block';

  // Rola até o formulário em telas menores
  document.querySelector('.card').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── Renderização ──────────────────────────────────────────────────────────

function formatarData(valor) {
  if (!valor) return '-';
  return new Date(valor).toLocaleString('pt-BR');
}

function aplicarFiltro(tarefas) {
  if (filtroAtivo === 'todas')    return tarefas;
  if (filtroAtivo === 'aberta')   return tarefas.filter((t) => t.status === 'aberta');
  if (filtroAtivo === 'concluida') return tarefas.filter((t) => t.status === 'concluida');
  return tarefas;
}

function renderizar() {
  const tarefas  = carregarTarefas();
  const visiveis = aplicarFiltro(tarefas);

  // Atualiza contador
  contador.textContent = `(${visiveis.length} tarefa${visiveis.length !== 1 ? 's' : ''})`;

  if (!visiveis.length) {
    taskList.innerHTML = `<tr><td colspan="9" class="vazio">Nenhuma tarefa encontrada.</td></tr>`;
    return;
  }

  taskList.innerHTML = visiveis.map((tarefa) => {
    const concluida    = tarefa.status === 'concluida';
    const badgeStatus  = concluida
      ? '<span class="badge badge-concluida">Concluída</span>'
      : '<span class="badge badge-aberta">Aberta</span>';

    const classPrioridade = `prioridade prioridade-${tarefa.prioridade.toLowerCase().replace('é', 'e')}`;
    const badgePrioridade = `<span class="${classPrioridade}">${tarefa.prioridade}</span>`;

    const trClass = tarefa.prioridade === 'Alta' && !concluida ? 'alta' : '';

    const btnConcluirReabrir = concluida
      ? `<button class="btn-reabrir"  data-id="${tarefa.id}">Reabrir</button>`
      : `<button class="btn-concluir" data-id="${tarefa.id}">Concluir</button>`;

    const btnEditar = concluida
      ? `<button class="btn-edit" data-id="${tarefa.id}" disabled title="Tarefas concluídas não podem ser editadas">Editar</button>`
      : `<button class="btn-edit" data-id="${tarefa.id}">Editar</button>`;

    return `
      <tr class="${trClass}">
        <td>${tarefa.id}</td>
        <td>${tarefa.responsavel}</td>
        <td>${tarefa.tarefaPrincipal}</td>
        <td>${tarefa.descricao || '-'}</td>
        <td>${badgePrioridade}</td>
        <td>${badgeStatus}</td>
        <td class="small">${formatarData(tarefa.dataInicio)}</td>
        <td class="small">${formatarData(tarefa.dataConclusao)}</td>
        <td>
          <div class="acoes">
            ${btnEditar}
            ${btnConcluirReabrir}
            <button class="btn-delete" data-id="${tarefa.id}">Excluir</button>
          </div>
        </td>
      </tr>`;
  }).join('');
}

// ── Operações CRUD ────────────────────────────────────────────────────────

function criarTarefa() {
  if (!validarFormulario()) return;

  const tarefas = carregarTarefas();

  const novaTarefa = {
    id:             proximoId(tarefas),
    responsavel:    responsavelSelect.value,
    tarefaPrincipal: tarefaPrincipalInput.value.trim(),
    prioridade:     prioridadeSelect.value,
    descricao:      descricaoInput.value.trim(),
    status:         'aberta',
    dataInicio:     new Date().toISOString(),
    dataConclusao:  null,
  };

  tarefas.push(novaTarefa);
  salvarTarefas(tarefas);

  showFeedback('Tarefa criada com sucesso!');
  limparFormulario();
  renderizar();
}

function salvarEdicao() {
  if (!idInput.value) {
    showFeedback('Nenhuma tarefa selecionada para edição.', 'error');
    return;
  }

  if (!validarFormulario()) return;

  const tarefas = carregarTarefas();
  const index   = tarefas.findIndex((t) => t.id === Number(idInput.value));

  if (index === -1) {
    showFeedback('Tarefa não encontrada.', 'error');
    return;
  }

  // Preserva status, datas e id — só altera campos editáveis
  tarefas[index] = {
    ...tarefas[index],
    responsavel:     responsavelSelect.value,
    tarefaPrincipal: tarefaPrincipalInput.value.trim(),
    prioridade:      prioridadeSelect.value,
    descricao:       descricaoInput.value.trim(),
  };

  salvarTarefas(tarefas);
  showFeedback('Tarefa atualizada com sucesso!');
  limparFormulario();
  renderizar();
}

function concluirTarefa(id) {
  const tarefas = carregarTarefas();
  const index   = tarefas.findIndex((t) => t.id === id);

  if (index === -1) return;

  if (tarefas[index].status === 'concluida') {
    showFeedback('Esta tarefa já está concluída.', 'error');
    return;
  }

  tarefas[index].status        = 'concluida';
  tarefas[index].dataConclusao = new Date().toISOString();

  salvarTarefas(tarefas);
  showFeedback('Tarefa concluída!');
  renderizar();
}

function reabrirTarefa(id) {
  const tarefas = carregarTarefas();
  const index   = tarefas.findIndex((t) => t.id === id);

  if (index === -1) return;

  tarefas[index].status        = 'aberta';
  tarefas[index].dataConclusao = null;

  salvarTarefas(tarefas);
  showFeedback('Tarefa reaberta.');
  renderizar();
}

function excluirTarefa(id) {
  const tarefas  = carregarTarefas();
  const filtrada = tarefas.filter((t) => t.id !== id);

  salvarTarefas(filtrada);
  showFeedback('Tarefa excluída.');

  // Se estava editando essa tarefa, limpa o formulário
  if (Number(idInput.value) === id) limparFormulario();

  renderizar();
}

function editarTarefa(id) {
  const tarefas = carregarTarefas();
  const tarefa  = tarefas.find((t) => t.id === id);

  if (!tarefa) return;

  if (tarefa.status === 'concluida') {
    showFeedback('Tarefas concluídas não podem ser editadas.', 'error');
    return;
  }

  modoEdicao(tarefa);
}

// ── Eventos ───────────────────────────────────────────────────────────────

btnCriar.addEventListener('click', criarTarefa);
btnSalvar.addEventListener('click', salvarEdicao);
btnCancelar.addEventListener('click', limparFormulario);

// Contador de caracteres da descrição
descricaoInput.addEventListener('input', () => {
  charCount.textContent = `${descricaoInput.value.length} / 300`;
});

// Delegação de eventos na tabela
taskList.addEventListener('click', (event) => {
  const btn = event.target.closest('button');
  if (!btn) return;

  const id = Number(btn.dataset.id);

  if (btn.classList.contains('btn-edit'))     editarTarefa(id);
  if (btn.classList.contains('btn-concluir')) concluirTarefa(id);
  if (btn.classList.contains('btn-reabrir'))  reabrirTarefa(id);
  if (btn.classList.contains('btn-delete'))   excluirTarefa(id);
});

// Filtros
botoesFiltro.forEach((btn) => {
  btn.addEventListener('click', () => {
    botoesFiltro.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    filtroAtivo = btn.dataset.filtro;
    renderizar();
  });
});

// ── Inicialização ─────────────────────────────────────────────────────────
limparFormulario();
renderizar();