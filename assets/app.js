const config = window.ERP5_CONFIG || {};

function validConfig(value) {
  return Array.isArray(value.superUserBots) && Array.isArray(value.departmentBots);
}

function buildBotIndex() {
  const index = new Map();

  (config.superUserBots || []).forEach(bot => {
    index.set(bot.id, { ...bot, parentId: null, topParentId: null });
  });

  (config.departmentBots || []).forEach(department => {
    index.set(department.id, { ...department, parentId: null, topParentId: department.id });

    (department.functionalBots || []).forEach(functional => {
      index.set(functional.id, {
        ...functional,
        parentId: department.id,
        topParentId: department.id
      });

      (functional.workflowBots || []).forEach(workflow => {
        index.set(workflow.id, {
          ...workflow,
          parentId: functional.id,
          topParentId: department.id
        });
      });
    });
  });

  return index;
}

const botIndex = validConfig(config) ? buildBotIndex() : new Map();
const defaultSuper = validConfig(config) && config.superUserBots.length ? config.superUserBots[0].id : null;

const state = {
  selectedSection: 'super',
  selectedBotId: defaultSuper,
  expandedDepartmentId: validConfig(config) && config.departmentBots.length ? config.departmentBots[0].id : null,
  expandedFunctionalId: validConfig(config) && config.departmentBots[0]?.functionalBots?.[0]?.id ? config.departmentBots[0].functionalBots[0].id : null
};

const els = {
  hero: document.getElementById('hero'),
  superSection: document.getElementById('super-bots-section'),
  departmentSection: document.getElementById('department-bots-section'),
  config: document.getElementById('config-panel')
};

function badge(text, tone = '') {
  return `<span class="badge ${tone}">${text}</span>`;
}

function plusCard(label, scope, parentId = '') {
  return `
    <button class="bot-card add-card" data-add-scope="${scope}" data-parent-id="${parentId}">
      <span class="plus-mark">+</span>
      <span>${label}</span>
    </button>
  `;
}

function levelLabel(level) {
  return {
    super: 'Super user bot',
    department: 'Department bot',
    functional: 'Functional bot',
    workflow: 'Workflow bot'
  }[level] || 'Bot';
}

function findSelectedBot() {
  if (state.selectedSection === 'super') {
    return config.superUserBots.find(bot => bot.id === state.selectedBotId) || null;
  }
  return botIndex.get(state.selectedBotId) || null;
}

function renderHero() {
  const totalDept = config.departmentBots.length;
  const totalFunctional = config.departmentBots.reduce((acc, bot) => acc + (bot.functionalBots?.length || 0), 0);
  const totalWorkflow = config.departmentBots.reduce(
    (acc, bot) => acc + (bot.functionalBots || []).reduce((inner, functional) => inner + (functional.workflowBots?.length || 0), 0),
    0
  );

  els.hero.innerHTML = `
    <div>
      <div class="eyebrow">Whiteboard rebuild</div>
      <h1>${config.meta.title}</h1>
      <p>${config.meta.subtitle}</p>
    </div>
    <div class="hero-stats">
      <div class="stat-card"><div class="stat-label">Super user bots</div><div class="stat-value">${config.superUserBots.length}</div></div>
      <div class="stat-card"><div class="stat-label">Department bots</div><div class="stat-value">${totalDept}</div></div>
      <div class="stat-card"><div class="stat-label">Functional bots</div><div class="stat-value">${totalFunctional}</div></div>
      <div class="stat-card"><div class="stat-label">Workflow bots</div><div class="stat-value">${totalWorkflow}</div></div>
    </div>
  `;
}

function superCard(bot) {
  return `
    <button class="bot-card ${state.selectedSection === 'super' && state.selectedBotId === bot.id ? 'active' : ''}" data-bot-id="${bot.id}" data-section="super">
      <div class="card-head">
        <h3>${bot.name}</h3>
        ${badge(bot.status, bot.status === 'Active' ? 'success' : 'warning')}
      </div>
      <p>${bot.purpose}</p>
      <div class="meta-row">${badge('Owner: ' + bot.owner)} ${badge('Template: ' + bot.template, 'accent')}</div>
    </button>
  `;
}

function workflowCard(workflow) {
  return `
    <button class="workflow-card ${state.selectedSection === 'department' && state.selectedBotId === workflow.id ? 'active' : ''}" data-bot-id="${workflow.id}" data-section="department">
      <div class="card-head">
        <h5>${workflow.name}</h5>
        ${badge(workflow.status, workflow.status === 'Active' ? 'success' : 'warning')}
      </div>
      <p>${workflow.purpose}</p>
    </button>
  `;
}

function functionalCard(functional, departmentId) {
  const expanded = state.expandedFunctionalId === functional.id;
  return `
    <div class="functional-block">
      <div class="functional-row">
        <button class="child-card functional-card ${state.selectedSection === 'department' && state.selectedBotId === functional.id ? 'active' : ''}" data-bot-id="${functional.id}" data-section="department">
          <div class="card-head">
            <h4>${functional.name}</h4>
            ${badge(functional.status, functional.status === 'Active' ? 'success' : 'warning')}
          </div>
          <p>${functional.purpose}</p>
          <div class="meta-row">${badge('Owner: ' + functional.owner)} ${badge(`${functional.workflowBots.length} workflow bots`, 'accent')}</div>
        </button>
        <button class="expand-toggle small-toggle" data-expand-functional-id="${functional.id}">${expanded ? 'Hide workflows' : 'Show workflows'}</button>
      </div>
      ${expanded ? `
        <div class="workflow-lane">
          ${(functional.workflowBots || []).map(workflowCard).join('')}
          ${plusCard('Add workflow bot', 'workflow', functional.id)}
        </div>
      ` : ''}
    </div>
  `;
}

function departmentCard(bot) {
  const expanded = state.expandedDepartmentId === bot.id;
  return `
    <div class="department-block">
      <div class="department-row">
        <button class="bot-card ${state.selectedSection === 'department' && state.selectedBotId === bot.id ? 'active' : ''}" data-bot-id="${bot.id}" data-section="department">
          <div class="card-head">
            <h3>${bot.name}</h3>
            ${badge(bot.status, bot.status === 'Active' ? 'success' : 'warning')}
          </div>
          <p>${bot.purpose}</p>
          <div class="meta-row">${badge('Owner: ' + bot.owner)} ${badge(`${bot.functionalBots.length} functional bots`, 'accent')}</div>
        </button>
        <button class="expand-toggle" data-expand-id="${bot.id}">${expanded ? 'Hide functions' : 'Show functions'}</button>
      </div>
      ${expanded ? `
        <div class="child-lane">
          ${(bot.functionalBots || []).map(functional => functionalCard(functional, bot.id)).join('')}
          ${plusCard('Add functional bot', 'functional', bot.id)}
        </div>
      ` : ''}
    </div>
  `;
}

function renderSuperSection() {
  els.superSection.innerHTML = `
    <div class="section-header">
      <h2>Super User Bot</h2>
      <p>Small set of global bots with enterprise-wide or cross-functional roles.</p>
    </div>
    <div class="bot-lane">
      ${config.superUserBots.map(superCard).join('')}
      ${plusCard('Add super user bot', 'super')}
    </div>
  `;
}

function renderDepartmentSection() {
  els.departmentSection.innerHTML = `
    <div class="section-header">
      <h2>Department Bot</h2>
      <p>Department bots expand into functional bots, and functional bots expand into single-workflow bots.</p>
    </div>
    <div class="department-stack">
      ${config.departmentBots.map(departmentCard).join('')}
      <div class="bot-lane bottom-lane">${plusCard('Add department bot', 'department')}</div>
    </div>
  `;
}

function renderConfigPanel() {
  const bot = findSelectedBot();
  const isAddMode = !bot;
  const templates = (config.botTemplates || []).map(name => `<span class="pill">${name}</span>`).join('');

  if (isAddMode) {
    els.config.innerHTML = `
      <div class="config-head">
        <div class="eyebrow">Bot configuration</div>
        <h2>Create Bot</h2>
        <p>Select a plus button from the structure to create a new super, department, functional, or workflow bot.</p>
      </div>
      <div class="config-card">
        <h3>Templates / default settings</h3>
        <div class="pill-row">${templates}</div>
      </div>
      <div class="config-card">
        <h3>Configuration flow</h3>
        <ol class="plain-list numbered">
          <li>Choose where the bot should live in the structure.</li>
          <li>Pick a template or start blank.</li>
          <li>Assign users and roles.</li>
          <li>Configure skills, memory, and permissions.</li>
        </ol>
      </div>
    `;
    return;
  }

  const users = (bot.users || []).map(user => `<div class="kv-row"><span>${user.name}</span><span class="muted">${user.role}</span></div>`).join('');
  const skills = (bot.skills || []).map(item => `<span class="pill">${item}</span>`).join('');
  const memory = (bot.memory || []).map(item => `<span class="pill">${item}</span>`).join('');
  const permissions = (bot.permissions || []).map(item => `<span class="pill">${item}</span>`).join('');

  let childSummary = '';
  if (bot.level === 'department') {
    childSummary = `<div class="kv-row"><span>Functional bots</span><span class="muted">${bot.functionalBots?.length || 0}</span></div>`;
  } else if (bot.level === 'functional') {
    childSummary = `<div class="kv-row"><span>Workflow bots</span><span class="muted">${bot.workflowBots?.length || 0}</span></div>`;
  }

  els.config.innerHTML = `
    <div class="config-head">
      <div class="eyebrow">Bot configuration</div>
      <h2>${bot.name}</h2>
      <p>${bot.purpose}</p>
    </div>

    <div class="config-card">
      <h3>Basic</h3>
      <div class="kv-row"><span>Level</span><span class="muted">${levelLabel(bot.level)}</span></div>
      <div class="kv-row"><span>Owner</span><span class="muted">${bot.owner}</span></div>
      <div class="kv-row"><span>Status</span><span class="muted">${bot.status}</span></div>
      <div class="kv-row"><span>Template</span><span class="muted">${bot.template}</span></div>
      ${childSummary}
    </div>

    <div class="config-card">
      <h3>Users & roles</h3>
      ${users}
    </div>

    <div class="config-card">
      <h3>Skills</h3>
      <div class="pill-row">${skills || '<span class="muted">No skills selected</span>'}</div>
    </div>

    <div class="config-card">
      <h3>Memory</h3>
      <div class="pill-row">${memory || '<span class="muted">No memory sources selected</span>'}</div>
    </div>

    <div class="config-card">
      <h3>Permissions</h3>
      <div class="pill-row">${permissions || '<span class="muted">No permissions selected</span>'}</div>
    </div>

    <div class="config-card">
      <h3>Templates</h3>
      <div class="pill-row">${templates}</div>
    </div>
  `;
}

function bindInteractions() {
  document.querySelectorAll('[data-bot-id]').forEach(el => {
    el.addEventListener('click', () => {
      state.selectedBotId = el.dataset.botId;
      state.selectedSection = el.dataset.section;
      render();
    });
  });

  document.querySelectorAll('[data-expand-id]').forEach(el => {
    el.addEventListener('click', () => {
      const id = el.dataset.expandId;
      state.expandedDepartmentId = state.expandedDepartmentId === id ? null : id;
      render();
    });
  });

  document.querySelectorAll('[data-expand-functional-id]').forEach(el => {
    el.addEventListener('click', () => {
      const id = el.dataset.expandFunctionalId;
      state.expandedFunctionalId = state.expandedFunctionalId === id ? null : id;
      render();
    });
  });

  document.querySelectorAll('[data-add-scope]').forEach(el => {
    el.addEventListener('click', () => {
      const scope = el.dataset.addScope;
      state.selectedSection = scope === 'super' ? 'super' : 'department';
      state.selectedBotId = null;
      render();
    });
  });
}

function renderError() {
  document.title = 'ERP5 — Config Error';
  document.body.innerHTML = '<div style="padding:24px;color:white">ERP5 configuration is missing or malformed.</div>';
}

function render() {
  if (!validConfig(config)) {
    renderError();
    return;
  }
  document.title = config.meta.title;
  renderHero();
  renderSuperSection();
  renderDepartmentSection();
  renderConfigPanel();
  bindInteractions();
}

render();
