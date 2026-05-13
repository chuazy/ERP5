window.ERP5_CONFIG = {
  meta: {
    title: "ERP5 Bot Setup",
    subtitle: "Start simple: define bot types, place bots in the org chart, and assign people to each bot.",
    company: "CARRO-style enterprise harness"
  },
  botTypes: [
    {
      id: "finance-ops",
      name: "Finance Bot",
      purpose: "Handles finance workflows like reconciliation, close support, and invoice checks.",
      defaultUsers: ["Finance manager", "Ops analyst"],
      capabilities: ["reconciliation", "variance review", "report prep"]
    },
    {
      id: "support-ops",
      name: "Support Bot",
      purpose: "Supports ticket triage, escalation routing, and response drafting.",
      defaultUsers: ["Support lead", "QA reviewer"],
      capabilities: ["triage", "routing", "knowledge suggestions"]
    },
    {
      id: "eng-ops",
      name: "Engineering Bot",
      purpose: "Helps planning, implementation, review coordination, and incident support.",
      defaultUsers: ["Engineering manager", "Tech lead"],
      capabilities: ["planning", "build support", "review assistance"]
    },
    {
      id: "hr-ops",
      name: "HR Bot",
      purpose: "Assists onboarding, policy lookup, and people operations workflows.",
      defaultUsers: ["HRBP", "People ops specialist"],
      capabilities: ["onboarding", "policy Q&A", "workflow tracking"]
    },
    {
      id: "exec-assist",
      name: "Executive Assistant Bot",
      purpose: "Supports cross-functional coordination, summaries, and follow-up tracking.",
      defaultUsers: ["Chief of staff", "Executive office"],
      capabilities: ["briefing", "follow-ups", "cross-team coordination"]
    }
  ],
  orgChart: [
    {
      id: "company",
      name: "Enterprise",
      type: "Company",
      bots: ["Executive Assistant Bot"],
      children: [
        {
          id: "finance",
          name: "Finance",
          type: "Department",
          bots: ["Finance Bot"],
          children: [
            {
              id: "r2r",
              name: "Record-to-Report",
              type: "Team",
              bots: ["Finance Bot"],
              children: []
            }
          ]
        },
        {
          id: "support",
          name: "Support",
          type: "Department",
          bots: ["Support Bot"],
          children: [
            {
              id: "escalations",
              name: "Escalations",
              type: "Team",
              bots: ["Support Bot"],
              children: []
            }
          ]
        },
        {
          id: "engineering",
          name: "Engineering",
          type: "Department",
          bots: ["Engineering Bot"],
          children: [
            {
              id: "platform",
              name: "Platform",
              type: "Team",
              bots: ["Engineering Bot"],
              children: []
            }
          ]
        },
        {
          id: "people",
          name: "People & HR",
          type: "Department",
          bots: ["HR Bot"],
          children: []
        }
      ]
    }
  ],
  assignments: {
    "Executive Assistant Bot": {
      owner: "Zee",
      orgUnit: "Enterprise",
      users: ["Chief of staff", "Strategy lead", "Executive office coordinator"],
      notes: "Good for company-level summaries and cross-functional follow-up."
    },
    "Finance Bot": {
      owner: "Finance director",
      orgUnit: "Finance / Record-to-Report",
      users: ["Finance manager", "Controller", "Ops analyst"],
      notes: "Anchor bot for finance workflows before splitting into more specialized bots."
    },
    "Support Bot": {
      owner: "Head of support",
      orgUnit: "Support / Escalations",
      users: ["Support lead", "Escalation manager", "QA reviewer"],
      notes: "Useful for triage and consistent handoff rules."
    },
    "Engineering Bot": {
      owner: "VP Engineering",
      orgUnit: "Engineering / Platform",
      users: ["Engineering manager", "Tech lead", "Developer productivity lead"],
      notes: "Start broad, then split into planner / builder / reviewer later if needed."
    },
    "HR Bot": {
      owner: "Head of people",
      orgUnit: "People & HR",
      users: ["HRBP", "People ops specialist"],
      notes: "Useful for repeatable internal workflows and policy support."
    }
  }
};
