window.ERP5_CONFIG = {
  meta: {
    title: "ERP5 Enterprise Harness Dashboard",
    subtitle:
      "Foundational operating model for an enterprise agent harness: org-persistent ownership, workstream execution, externalized permissions, governed memory, and elastic runtime workers.",
    status: "Prototype — control-plane foundation",
    owner: "Zee",
    designPrinciple: "Org chart is ownership. Workstreams are operations. Permissions are control. Runtime agents are execution."
  },
  navigation: [
    { id: "overview", title: "Overview", subtitle: "8-layer architecture and system framing" },
    { id: "topology", title: "Topology", subtitle: "Domains, workstreams, functions, agent cells" },
    { id: "governance", title: "Governance", subtitle: "Policies, permissions, decision rights" },
    { id: "registries", title: "Memory + Skills", subtitle: "Persistent knowledge and reusable capability" },
    { id: "walkthroughs", title: "Walkthroughs", subtitle: "Concrete functional examples" }
  ],
  principles: [
    "Persistent agents should map to durable enterprise units, not individual employees.",
    "Permissions should be enforced externally, not hidden inside prompts.",
    "Memory belongs to domains and workstreams, not ephemeral runtime instances.",
    "Inter-agent communication should use structured task contracts, not free-form chatter.",
    "1:n:n beats 1:1 mirroring — many workstreams per domain, many runtimes per workflow."
  ],
  summary: [
    { label: "Persistent layers", value: "6", footnote: "Constitution through memory" },
    { label: "Runtime layer", value: "1", footnote: "Elastic workers instantiated per task" },
    { label: "Contract layer", value: "1", footnote: "Typed handoffs and task schemas" },
    { label: "Example domains", value: "3", footnote: "Finance, Support, Engineering" }
  ],
  layers: [
    {
      index: "L0",
      name: "Enterprise Constitution",
      owner: "Executive / governance council",
      purpose: "Defines non-negotiable operating principles, risk boundaries, escalation triggers, and success metrics.",
      controls: ["mission", "risk tolerances", "approval thresholds"]
    },
    {
      index: "L1",
      name: "Domain / Department",
      owner: "Department head",
      purpose: "Represents durable ownership boundaries like Finance, Support, and Engineering.",
      controls: ["domain charter", "data ownership", "business KPIs"]
    },
    {
      index: "L2",
      name: "Workstream",
      owner: "Functional lead / process owner",
      purpose: "Primary operating unit where workflows, SLAs, exception routing, and handoffs are defined.",
      controls: ["workflow map", "SLA", "exception policy"]
    },
    {
      index: "L3",
      name: "Permission / Policy",
      owner: "Security + platform governance",
      purpose: "Externalized enforcement layer that governs tool access, data classification, and approval rules.",
      controls: ["tool scopes", "approval gates", "segregation of duties"]
    },
    {
      index: "L4",
      name: "Capability / Skill",
      owner: "Platform team + domain maintainers",
      purpose: "Versioned reusable procedures, tools, templates, and evaluable action bundles.",
      controls: ["versioning", "benchmarks", "ownership"]
    },
    {
      index: "L5",
      name: "Memory",
      owner: "Domain/workstream stewards",
      purpose: "Persistent knowledge assets promoted through governance instead of being trapped inside an agent instance.",
      controls: ["promotion rules", "retention", "quality review"]
    },
    {
      index: "L6",
      name: "Runtime Workers",
      owner: "Execution platform",
      purpose: "Elastic runtime agents instantiated for specific tasks with bounded context and permissions.",
      controls: ["spawn policy", "budget limits", "session lifecycle"]
    },
    {
      index: "L7",
      name: "Task Contracts",
      owner: "Interoperability framework",
      purpose: "Structured payloads for assignment, handoff, review, escalation, and completion across agents and systems.",
      controls: ["schema", "status model", "audit trail"]
    }
  ],
  topology: {
    model: "1:n:n",
    description:
      "Departments own domains. Domains contain multiple workstreams. Workstreams can expose several functions and spawn many workflow-specific runtime workers.",
    domains: [
      {
        name: "Finance",
        charter: "Financial truth, control, and close reliability.",
        workstreams: ["Record-to-Report", "Procure-to-Pay", "Order-to-Cash"],
        functions: ["reconciliation", "cash management", "variance review"],
        agents: ["recon worker", "close exception triager", "invoice validation runtime"]
      },
      {
        name: "Support",
        charter: "Customer issue resolution with SLA compliance and escalation discipline.",
        workstreams: ["Inbound Triage", "Escalations", "Knowledge Operations"],
        functions: ["classification", "priority assignment", "resolution suggestion"],
        agents: ["ticket router", "case summarizer", "KB gap detector"]
      },
      {
        name: "Engineering",
        charter: "Reliable software delivery and platform evolution.",
        workstreams: ["Spec-to-Build", "Incident Response", "Platform Operations"],
        functions: ["planning", "build execution", "verification"],
        agents: ["spec analyst", "builder runtime", "review runtime"]
      }
    ]
  },
  governance: {
    thesis:
      "Policy should sit outside the agent prompt. The harness should decide what an agent may do before the agent decides how to do it.",
    domains: [
      {
        title: "Identity & Access",
        owner: "Platform security",
        rules: [
          "Map every runtime worker to a permission bundle.",
          "Differentiate read, propose, execute, and approve scopes.",
          "Require human approval for threshold-exceeding financial or production actions."
        ]
      },
      {
        title: "Memory Governance",
        owner: "Domain stewards",
        rules: [
          "Separate draft observations from promoted operating memory.",
          "Tag every artifact by owner, retention, and confidence.",
          "Expire stale memory unless reaffirmed or benchmarked."
        ]
      },
      {
        title: "Capability Governance",
        owner: "Platform + domain maintainers",
        rules: [
          "Version skills like code.",
          "Attach evaluation criteria before broad rollout.",
          "Track which workstreams consume each skill and where failures occur."
        ]
      }
    ],
    matrix: [
      { layer: "Constitution", owner: "Exec", approves: "Exec council", monitors: "Audit / COO" },
      { layer: "Domain", owner: "Department head", approves: "Functional leadership", monitors: "Ops reviews" },
      { layer: "Workstream", owner: "Process owner", approves: "Domain lead", monitors: "SLA dashboard" },
      { layer: "Permissions", owner: "Security/platform", approves: "Risk owner", monitors: "Access logs" },
      { layer: "Skills", owner: "Platform + SME", approves: "Capability steward", monitors: "Eval metrics" },
      { layer: "Memory", owner: "Domain steward", approves: "Reviewer", monitors: "Freshness / reuse" }
    ]
  },
  registries: {
    memory: [
      {
        name: "Close playbook",
        scope: "Finance / R2R",
        status: "Promoted",
        note: "Month-end close steps, evidence checklist, exception handling."
      },
      {
        name: "Escalation heuristics",
        scope: "Support / Escalations",
        status: "Draft",
        note: "Patterns for routing customer-impacting incidents."
      },
      {
        name: "Incident postmortem library",
        scope: "Engineering / Incident Response",
        status: "Promoted",
        note: "Standardized learnings and mitigations reusable across incidents."
      }
    ],
    skills: [
      {
        name: "Bank reconciliation",
        version: "v1.3",
        owner: "Finance platform",
        status: "Healthy",
        note: "Structured recon workflow with validation and exception routing."
      },
      {
        name: "Ticket triage classifier",
        version: "v0.8",
        owner: "Support ops",
        status: "Needs review",
        note: "Classification drift detected for billing-related cases."
      },
      {
        name: "PR review orchestration",
        version: "v2.1",
        owner: "Developer productivity",
        status: "Healthy",
        note: "Spec check + code quality review with merge gate outputs."
      }
    ]
  },
  walkthroughs: [
    {
      name: "Finance: bank reconciliation",
      problem: "Need high-confidence recon with auditability and approval discipline.",
      flow: [
        "Finance domain owns the charter and control standards.",
        "Bank reconciliation workstream defines inputs, SLA, exception rules, and approvers.",
        "Permission layer grants read on statements, propose on match results, execute only within threshold.",
        "Skill layer provides the reconciliation procedure and evidence checklist.",
        "Memory layer stores promoted exceptions and prior issue patterns.",
        "Runtime worker executes a bounded recon task and emits a structured handoff contract."
      ]
    },
    {
      name: "Support: inbound ticket triage",
      problem: "Need scalable first-response classification without losing escalation quality.",
      flow: [
        "Support domain owns experience and SLA metrics.",
        "Inbound triage workstream defines category taxonomy and urgency rules.",
        "Permission layer restricts direct customer action while allowing summarization and routing.",
        "Memory layer captures recurring issue motifs and KB gaps.",
        "Runtime worker classifies, summarizes, and hands off to the right queue using a task contract."
      ]
    },
    {
      name: "Engineering: spec to build",
      problem: "Need structured execution from planning through implementation and review.",
      flow: [
        "Engineering domain owns delivery standards.",
        "Spec-to-build workstream separates planner, builder, and reviewer responsibilities.",
        "Permission layer distinguishes read, modify, approve, and deploy rights.",
        "Skill registry stores planning, debugging, testing, and review procedures.",
        "Runtime workers stay ephemeral while memory promotion preserves architectural learning."
      ]
    }
  ],
  rightColumnNotes: [
    {
      title: "Critical distinction",
      body: "This harness should not mirror the human org chart 1:1. Persistent entities should represent durable operating units and governance boundaries."
    },
    {
      title: "What persists vs what doesn’t",
      body: "Constitution, domains, workstreams, policies, skills, and memory persist. Runtime workers and task sessions are ephemeral by design."
    },
    {
      title: "Why config-driven first",
      body: "A structured data model forces clarity on what the control plane must represent before wiring to a backend."
    }
  ]
};
