# Sistema de Tarefas (CRUD + MVC)

Projeto em **HTML + CSS + JavaScript** sem frameworks, com persistência em arquivo `.txt`.

## Arquitetura MVC

- **Model:** `src/models/taskModel.js`
- **Controller:** `src/controllers/taskController.js`
- **View:**
  - Backend: `src/views/taskView.js` (arquivos estáticos)
  - Frontend: `public/index.html`, `public/styles.css`, `public/app.js`

## Como executar localmente

```bash
node server.js
```

Abra: `http://localhost:3000`

## Persistência

- Usuários: `data/users.txt`
- Tarefas: `data/tasks.txt`

As tarefas são gravadas em JSON dentro de um arquivo de texto.
