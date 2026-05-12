const config = window.ERP5_CONFIG;

function isValidConfig(value) {
  return Boolean(
    value &&
    value.meta &&
    Array.isArray(value.navigation) &&
    value.navigation.length > 0
  );
}

function getSectionIds() {
  return (config?.navigation || []).map(item => item.id);
}

function getSectionFromHash() {
  const hash = window.location.hash.replace('#', '');
  return getSectionIds().includes(hash) ? hash : null;
}

const fallbackSection = isValidConfig(config) ? config.navigation[0].id : 'overview';

const state = {
  section: getSectionFromHash() || fallbackSection
};

const els = {
  nav: document.getElementById('main-nav'),
  hero: document.getElementById('hero'),
  summary: document.getElementById('summary-grid'),
  tabs: document.getElementById('tab-strip'),
  primary: document.getElementById('primary-column'),
  secondary: document.getElementById('secondary-column'),
  principles: document.getElementById('principles-panel')
};

function card(title, body) {
  return `
    <section class="card">
      <h3>${title}</h3>
      ${body}
    </section>
  `;
}

function badge(text, tone = '') {
  return `<span class="badge ${tone}">${text}</span>`;
}

function renderSidebar() {
  els.nav.innerHTML = config.navigation.map(item => `
    <button class="nav-button ${state.section === item.id ? 'active' : ''}" data-section="${item.id}">
      <span class="nav-title">${item.title}</span>
      <span class="nav-subtitle">${item.subtitle}</span>
    </button>
  `).join('');

  els.principles.innerHTML = `
    <h3>Design principles</h3>
    <ul class="list-clean">
      ${config.principles.map(item => `<li>${item}</li>`).join('')}
    </ul>
  `;

  els.nav.querySelectorAll('[data-section]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.section = btn.dataset.section;
      window.location.hash = state.section;
      render();
    });
  });
}

function renderHero() {
  els.hero.innerHTML = `
    <div class="eyebrow">${config.meta.status}</div>
    <h2>${config.meta.title}</h2>
    <p>${config.meta.subtitle}</p>
    <div class="hero-stats">
      <div class="pill"><strong>Owner</strong> ${config.meta.owner}</div>
      <div class="pill"><strong>Model</strong> org-persistent / permission-governed</div>
      <div class="pill"><strong>Guiding idea</strong> ${config.meta.designPrinciple}</div>
    </div>
  `;
}

function renderSummary() {
  els.summary.innerHTML = config.summary.map(item => `
    <section class="card metric-card">
      <div class="metric-label">${item.label}</div>
      <div class="metric-value">${item.value}</div>
      <div class="metric-footnote">${item.footnote}</div>
    </section>
  `).join('');
}

function renderTabs() {
  els.tabs.innerHTML = config.navigation.map(item => `
    <button class="tab-button ${state.section === item.id ? 'active' : ''}" data-section="${item.id}">${item.title}</button>
  `).join('');

  els.tabs.querySelectorAll('[data-section]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.section = btn.dataset.section;
      window.location.hash = state.section;
      render();
    });
  });
}

function sectionOverview() {
  const layers = `
    <div class="layer-grid">
      ${config.layers.map(layer => `
        <div class="layer-card">
          <div class="layer-index">${layer.index}</div>
          <h4>${layer.name}</h4>
          <p>${layer.purpose}</p>
          <div class="small"><span class="label-strong">Owner:</span> ${layer.owner}</div>
          <div class="badge-row">${layer.controls.map(c => badge(c, 'accent')).join('')}</div>
        </div>
      `).join('')}
    </div>
  `;

  const why = `
    <div class="kpi-grid">
      <div class="registry-card">
        <h4>Why persistent units matter</h4>
        <p>People change. Durable enterprise memory and control should survive organizational turnover.</p>
      </div>
      <div class="registry-card">
        <h4>Why permissions are externalized</h4>
        <p>Prompt-only policy is brittle. Enforcement should happen outside the agent before execution.</p>
      </div>
      <div class="registry-card">
        <h4>Why workstreams are primary</h4>
        <p>Departments indicate ownership. Workstreams describe how real work moves and where SLAs live.</p>
      </div>
    </div>
  `;

  return {
    primary: [
      card('8-layer enterprise harness model', layers),
      card('Why this architecture exists', why)
    ],
    secondary: notesColumn()
  };
}

function sectionTopology() {
  const domainCards = config.topology.domains.map(domain => `
    <div class="topology-card">
      <h4>${domain.name}</h4>
      <p>${domain.charter}</p>
      <div class="small"><span class="label-strong">Workstreams</span></div>
      <div class="chip-row">${domain.workstreams.map(item => `<span class="chip">${item}</span>`).join('')}</div>
      <div class="small" style="margin-top:12px"><span class="label-strong">Functions</span></div>
      <div class="chip-row">${domain.functions.map(item => `<span class="chip">${item}</span>`).join('')}</div>
      <div class="small" style="margin-top:12px"><span class="label-strong">Runtime agents</span></div>
      <ul class="list-clean">
        ${domain.agents.map(item => `<li class="code-inline">${item}</li>`).join('')}
      </ul>
    </div>
  `).join('');

  return {
    primary: [
      card('Topology model', `
        <p><span class="label-strong">Relationship:</span> ${config.topology.model}</p>
        <p>${config.topology.description}</p>
      `),
      card('Domains, workstreams, and runtime cells', `<div class="topology-grid">${domainCards}</div>`)
    ],
    secondary: [
      card('Topology implication', `
        <p>Do not design one named bot per department. Design domain ownership, workstream logic, and spawnable runtime cells per workflow.</p>
      `),
      ...notesColumn()
    ]
  };
}

function sectionGovernance() {
  const governanceCards = config.governance.domains.map(item => `
    <div class="matrix-card">
      <h4>${item.title}</h4>
      <div class="small"><span class="label-strong">Owner:</span> ${item.owner}</div>
      <ul class="list-clean">
        ${item.rules.map(rule => `<li>${rule}</li>`).join('')}
      </ul>
    </div>
  `).join('');

  const matrix = config.governance.matrix.map(row => `
    <div class="matrix-card">
      <h4>${row.layer}</h4>
      <div class="split-line"><span class="muted">Owner</span><span>${row.owner}</span></div>
      <div class="split-line"><span class="muted">Approves</span><span>${row.approves}</span></div>
      <div class="split-line"><span class="muted">Monitors</span><span>${row.monitors}</span></div>
    </div>
  `).join('');

  return {
    primary: [
      card('Governance thesis', `<p>${config.governance.thesis}</p>`),
      card('Control domains', `<div class="matrix-grid">${governanceCards}</div>`),
      card('Decision-rights matrix', `<div class="matrix-grid">${matrix}</div>`)
    ],
    secondary: [
      card('Pushback', `
        <p>If governance is buried in prompts, you do not have a real enterprise harness. You have fragile roleplay with optimistic compliance.</p>
      `),
      ...notesColumn()
    ]
  };
}

function sectionRegistries() {
  const memoryCards = config.registries.memory.map(item => `
    <div class="registry-card">
      <h4>${item.name}</h4>
      <div class="badge-row">
        ${badge(item.scope, 'accent')}
        ${badge(item.status, item.status === 'Promoted' ? 'success' : 'warning')}
      </div>
      <p>${item.note}</p>
    </div>
  `).join('');

  const skillCards = config.registries.skills.map(item => `
    <div class="registry-card">
      <h4>${item.name}</h4>
      <div class="badge-row">
        ${badge(item.version, 'accent')}
        ${badge(item.owner)}
        ${badge(item.status, item.status === 'Healthy' ? 'success' : 'warning')}
      </div>
      <p>${item.note}</p>
    </div>
  `).join('');

  return {
    primary: [
      card('Memory registry', `<div class="registry-grid">${memoryCards}</div>`),
      card('Skill registry', `<div class="registry-grid">${skillCards}</div>`)
    ],
    secondary: [
      card('Registry model', `
        <p>Memory and skills should be typed assets with owners, statuses, and governance — not mysterious blobs hidden inside agent sessions.</p>
      `),
      ...notesColumn()
    ]
  };
}

function sectionWalkthroughs() {
  const walkthroughCards = config.walkthroughs.map(item => `
    <div class="walkthrough-card">
      <h4>${item.name}</h4>
      <p><span class="label-strong">Problem:</span> ${item.problem}</p>
      <ul class="list-clean">
        ${item.flow.map(step => `<li>${step}</li>`).join('')}
      </ul>
    </div>
  `).join('');

  return {
    primary: [
      card('Functional walkthroughs', `<div class="walkthrough-grid">${walkthroughCards}</div>`)
    ],
    secondary: [
      card('What these examples prove', `
        <p>The harness model works only if the same layered structure can explain Finance, Support, and Engineering without rewriting the philosophy for each department.</p>
      `),
      ...notesColumn()
    ]
  };
}

function notesColumn() {
  return config.rightColumnNotes.map(item => card(item.title, `<p>${item.body}</p>`));
}

function renderSection() {
  const sections = {
    overview: sectionOverview,
    topology: sectionTopology,
    governance: sectionGovernance,
    registries: sectionRegistries,
    walkthroughs: sectionWalkthroughs
  };

  const sectionRenderer = sections[state.section] || sections[fallbackSection] || sections.overview;
  const current = sectionRenderer();
  els.primary.innerHTML = current.primary.join('');
  els.secondary.innerHTML = current.secondary.join('');
}

function renderError(message) {
  els.hero.innerHTML = `
    <div class="eyebrow">Configuration issue</div>
    <h2>ERP5 dashboard could not load</h2>
    <p>${message}</p>
  `;
  els.summary.innerHTML = '';
  els.tabs.innerHTML = '';
  els.primary.innerHTML = card('Recovery guidance', `
    <p>Check that <span class="code-inline">data/dashboard-config.js</span> is present and exports a valid <span class="code-inline">window.ERP5_CONFIG</span> object.</p>
  `);
  els.secondary.innerHTML = '';
}

function render() {
  if (!isValidConfig(config)) {
    renderError('The configuration object is missing or malformed.');
    document.title = 'ERP5 — Configuration Error';
    return;
  }

  renderSidebar();
  renderHero();
  renderSummary();
  renderTabs();
  renderSection();
  document.title = config.meta.title;
}

window.addEventListener('hashchange', () => {
  const nextSection = getSectionFromHash();
  if (nextSection) {
    state.section = nextSection;
    render();
  }
});

render();
