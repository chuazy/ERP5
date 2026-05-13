const config = window.ERP5_CONFIG || {};

function validConfig(value) {
  return Array.isArray(value.superUserBots) && Array.isArray(value.departmentBots);
}

function flattenBots(departmentBots) {
  const map = new Map();
  departmentBots.forEach(bot => {
    map.set(bot.id, { ...bot, kind: 'department', parentId: null });
    (bot.children || []).forEach(child => {
      map.set(child.id, { ...child, kind: 'child', parentId: bot.id });
    });
  });
  return map;
}

const departmentBotMap = validConfig(config) ? flattenBots(config.departmentBots) : new Map();
const defaultSuper = validConfig(config) && config.superUserBots.length ? config.superUserBots[0].id : null;

const state = {
  selectedSection: 'super',
  selectedBotId: defaultSuper,
  expandedDepartmentId: validConfig(config) && config.departmentBots.length ? config.departmentBots[0].id : null
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

function findSelectedBot() {
  if (state.selectedSection === 'super') {
    return config.superUserBots.find(bot => bot.id === state.selectedBotId) || null;
  }
  return departmentBotMap.get(state.selectedBotId) || null;
}

function renderHero() {
  const totalDept = config.departmentBots.length;
  const totalChildren = config.departmentBots.reduce((acc, bot) => acc + (bot.children?.length || 0), 0);
  els.hero.innerHTML = `
    <div>
      <div class="eyebrow">Whiteboard rebuild</div>
      <h1>${config.meta.title}</h1>
      <p>${config.meta.subtitle}</p>
    </div>
    <div class="hero-stats">
      <div class="stat-card"><div class="stat-label">Super user bots</div><div class="stat-value">${config.superUserBots.length}</div></div>
      <div class="stat-card"><div class="stat-label">Department bots</div><div class="stat-value">${totalDept}</div></div>
      <div class="stat-card"><div class="stat-label">Child bots</div><div class="stat-value">${totalChildren}</div></div>
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
          <div class="meta-row">${badge('Owner: ' + bot.owner)} ${badge(`${bot.children.length} child bots`, 'accent')}</div>
        </button>
        <button class="expand-toggle" data-expand-id="${bot.id}">${expanded ? 'Hide children' : 'Show children'}</button>
      </div>
      ${expanded ? `
        <div class="child-lane">
          ${(bot.children || []).map(child => `
            <button class="child-card ${state.selectedSection === 'department' && state.selectedBotId === child.id ? 'active' : ''}" data-bot-id="${child.id}" data-section="department">
              <div class="card-head">
                <h4>${child.name}</h4>
                ${badge(child.status, child.status === 'Active' ? 'success' : 'warning')}
              </div>
              <p>${child.purpose}</p>
            </button>
          `).join('')}
          ${plusCard('Add child bot', 'child', bot.id)}
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
      <p>Department bots are the working layer. Expand a department to manage child bots underneath it.</p>
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
        <p>Select a plus button from the structure to create a new super user bot, department bot, or child bot.</p>
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

  els.config.innerHTML = `
    <div class="config-head">
      <div class="eyebrow">Bot configuration</div>
      <h2>${bot.name}</h2>
      <p>${bot.purpose}</p>
    </div>

    <div class="config-card">
      <h3>Basic</h3>
      <div class="kv-row"><span>Scope</span><span class="muted">${state.selectedSection === 'super' ? 'Super user bot' : bot.kind === 'child' ? 'Child bot' : 'Department bot'}</span></div>
      <div class="kv-row"><span>Owner</span><span class="muted">${bot.owner}</span></div>
      <div class="kv-row"><span>Status</span><span class="muted">${bot.status}</span></div>
      <div class="kv-row"><span>Template</span><span class="muted">${bot.template}</span></div>
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

  document.querySelectorAll('[data-add-scope]').forEach(el => {
    el.addEventListener('click', () => {
      const scope = el.dataset.addScope;
      state.selectedSection = scope === 'super' ? 'super' : 'department';
      state.selectedBotId = null;
      if (scope === 'child') {
        state.expandedDepartmentId = el.dataset.parentId || state.expandedDepartmentId;
      }
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
