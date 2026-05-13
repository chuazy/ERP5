const config = window.ERP5_CONFIG || {};

function validConfig(value) {
  return Array.isArray(value.botTypes) && Array.isArray(value.orgChart);
}

function flattenOrg(nodes, depth = 1, acc = []) {
  nodes.forEach(node => {
    acc.push({ ...node, depth });
    if (Array.isArray(node.children) && node.children.length > 0) {
      flattenOrg(node.children, depth + 1, acc);
    }
  });
  return acc;
}

const orgNodes = validConfig(config) ? flattenOrg(config.orgChart) : [];
const defaultBot = validConfig(config) && config.botTypes.length ? config.botTypes[0].name : null;
const defaultOrg = orgNodes.length ? orgNodes[0].id : null;

const state = {
  selectedBot: defaultBot,
  selectedOrg: defaultOrg
};

const els = {
  topbar: document.getElementById('topbar'),
  botTypes: document.getElementById('bot-types-panel'),
  orgChart: document.getElementById('org-chart-panel'),
  assignments: document.getElementById('assignments-panel')
};

function badge(text, tone = 'accent') {
  return `<span class="badge ${tone}">${text}</span>`;
}

function botPill(text) {
  return `<span class="bot-pill">${text}</span>`;
}

function findBot(name) {
  return config.botTypes.find(bot => bot.name === name);
}

function findOrg(id) {
  return orgNodes.find(node => node.id === id);
}

function renderTopbar() {
  const botCount = config.botTypes.length;
  const unitCount = orgNodes.length;
  const selectedBotAssignment = config.assignments[state.selectedBot] || { users: [] };

  els.topbar.innerHTML = `
    <div>
      <div class="eyebrow">First-level view</div>
      <h1>${config.meta.title}</h1>
      <p>${config.meta.subtitle}</p>
    </div>
    <div class="kpi-row">
      <div class="info-card">
        <div class="info-label">Bot types</div>
        <div class="info-value">${botCount}</div>
      </div>
      <div class="info-card">
        <div class="info-label">Org units</div>
        <div class="info-value">${unitCount}</div>
      </div>
      <div class="info-card">
        <div class="info-label">Users on selected bot</div>
        <div class="info-value">${selectedBotAssignment.users.length}</div>
      </div>
    </div>
  `;
}

function renderBotTypes() {
  els.botTypes.innerHTML = `
    <div class="panel-header">
      <h2>1. Bot Types</h2>
      <p>Pick the kind of bot you want to set up first. Keep the first pass broad before splitting into more specialized bots.</p>
    </div>
    <div class="stack">
      ${config.botTypes.map(bot => `
        <div class="list-item selectable ${state.selectedBot === bot.name ? 'active' : ''}" data-bot="${bot.name}">
          <div class="title-row">
            <div>
              <h3>${bot.name}</h3>
              <div class="muted small">${bot.purpose}</div>
            </div>
            ${badge('Template')}
          </div>
          <div class="badge-row">
            ${bot.capabilities.map(item => badge(item)).join('')}
          </div>
          <div class="subsection-title">Suggested users</div>
          <div class="user-chip-row">
            ${bot.defaultUsers.map(user => `<span class="user-chip">${user}</span>`).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `;

  els.botTypes.querySelectorAll('[data-bot]').forEach(item => {
    item.addEventListener('click', () => {
      state.selectedBot = item.dataset.bot;
      render();
    });
  });
}

function renderOrgChart() {
  els.orgChart.innerHTML = `
    <div class="panel-header">
      <h2>2. Org Chart</h2>
      <p>See where bots sit in the company. Start with departments and teams; you can add more detail later.</p>
    </div>
    <div class="org-tree">
      ${orgNodes.map(node => `
        <div class="org-node org-depth-${Math.min(node.depth, 4)} selectable ${state.selectedOrg === node.id ? 'active' : ''}" data-org="${node.id}">
          <div class="title-row">
            <div>
              <h3>${node.name}</h3>
              <div class="muted small">${node.type}</div>
            </div>
            ${badge(node.type, 'success')}
          </div>
          <div class="mini-row">
            ${node.bots.map(botPill).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `;

  els.orgChart.querySelectorAll('[data-org]').forEach(item => {
    item.addEventListener('click', () => {
      state.selectedOrg = item.dataset.org;
      render();
    });
  });
}

function renderAssignments() {
  const bot = findBot(state.selectedBot);
  const org = findOrg(state.selectedOrg);
  const assignment = config.assignments[state.selectedBot] || { owner: 'Unassigned', users: [], notes: 'No notes yet.', orgUnit: 'Not assigned' };

  const orgRelevant = org && org.bots.includes(state.selectedBot);

  els.assignments.innerHTML = `
    <div class="panel-header">
      <h2>3. User Assignments</h2>
      <p>See who owns the selected bot and which users are attached to it. This is the simplest operating view.</p>
    </div>

    <div class="assignment-grid">
      <div class="assignment-card">
        <h3>${bot ? bot.name : 'No bot selected'}</h3>
        <div class="kv"><span class="muted">Assigned org unit</span><span>${assignment.orgUnit}</span></div>
        <div class="kv"><span class="muted">Owner</span><span>${assignment.owner}</span></div>
        <div class="kv"><span class="muted">Selected org node</span><span>${org ? org.name : 'None'}</span></div>
        <div class="kv"><span class="muted">Status</span><span>${orgRelevant ? 'Fits selected org node' : 'Selected bot sits elsewhere'}</span></div>
      </div>

      <div class="assignment-card">
        <h4>Assigned users</h4>
        <div class="user-chip-row">
          ${assignment.users.length ? assignment.users.map(user => `<span class="user-chip">${user}</span>`).join('') : '<span class="muted">No users assigned</span>'}
        </div>
      </div>

      <div class="assignment-card">
        <h4>Why this bot exists</h4>
        <div class="muted">${bot ? bot.purpose : 'Select a bot type.'}</div>
        <div class="subsection-title">Notes</div>
        <div class="muted">${assignment.notes}</div>
      </div>
    </div>

    <div class="helper-note">
      <strong>Recommended next step:</strong> once this simple setup view feels right, then we can add edit actions like <em>Create bot</em>, <em>Assign user</em>, and <em>Move bot to org unit</em> without bringing back the heavy architecture complexity.
    </div>
  `;
}

function renderError() {
  document.title = 'ERP5 — Config Error';
  els.topbar.innerHTML = `<div class="empty-state">ERP5 configuration is missing or malformed.</div>`;
  els.botTypes.innerHTML = '';
  els.orgChart.innerHTML = '';
  els.assignments.innerHTML = '';
}

function render() {
  if (!validConfig(config)) {
    renderError();
    return;
  }

  document.title = config.meta.title;
  renderTopbar();
  renderBotTypes();
  renderOrgChart();
  renderAssignments();
}

render();
