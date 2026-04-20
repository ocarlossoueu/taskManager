# Sistema de Gerenciamento de Tarefas

Projeto desenvolvido para a disciplina de **Qualidade de Software** — Bacharelado em Sistemas de Informação, Universidade Federal de Rondonópolis (UFR).

## Grupo 3

| Integrante | Responsabilidade |
|---|---|
| João Lucas Costa Santos | Coordenação técnica e arquitetura |
| Eduardo Ferreira Santana | Camada de dados (localStorage) e persistência |
| Carlos Amaral de Amarijo | Lógica de negócio e validações (script.js) |
| Marco Antônio Cardoso da Cruz Santos | Interface e experiência do usuário (HTML/CSS) |
| Victor Emmanuel de Assis Martins | Qualidade de software e documentação |

---

## Como executar

Sem instalação, sem servidor, sem dependências.

1. Clone o repositório:
   ```bash
   git clone https://github.com/ocarlossoueu/taskManager.git
   ```
2. Abra o arquivo `index.html` diretamente no navegador.

Pronto.

---

## Funcionalidades

- Cadastro de tarefas com Responsável, Tarefa Principal, Prioridade e Descrição
- Validação de campos obrigatórios com feedback visual por campo
- Listagem de tarefas em tabela com todas as informações
- Edição de tarefas abertas
- Conclusão e reabertura de tarefas
- Exclusão de tarefas
- Filtro por status: Todas / Abertas / Concluídas
- Destaque visual para tarefas de prioridade Alta ainda em aberto
- Feedback de sucesso e erro após cada operação
- Persistência dos dados via `localStorage` — os dados são mantidos entre sessões no mesmo navegador
- Layout responsivo compatível com dispositivos móveis

---

## Estrutura do projeto

```
taskManager/
├── index.html   — estrutura da interface
├── styles.css   — estilização e responsividade
├── script.js    — lógica, validações e persistência
└── README.md
```

---

## Tecnologias

- HTML5
- CSS3
- JavaScript puro (sem frameworks ou bibliotecas externas)
- localStorage (persistência client-side)

---

## Disciplina

Qualidade de Software — UFR, 2025