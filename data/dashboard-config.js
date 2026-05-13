window.ERP5_CONFIG = {
  meta: {
    title: "ERP5 Bot Structure",
    subtitle: "Start from structure: super user bots on top, department bots below, then configure the selected bot with templates, users, skills, memory, and permissions.",
    company: "Enterprise Bot Workspace"
  },
  superUserBots: [
    {
      id: "exec-orchestrator",
      name: "Executive Orchestrator",
      owner: "Zee",
      status: "Active",
      template: "Executive Coordination",
      purpose: "Cross-functional summaries, follow-up tracking, and escalation routing.",
      users: [
        { name: "Zee", role: "Owner" },
        { name: "Chief of Staff", role: "Admin" },
        { name: "Strategy Lead", role: "Member" }
      ],
      skills: ["briefing", "follow-up routing", "cross-team synthesis"],
      memory: ["leadership notes", "company priorities"],
      permissions: ["cross-functional visibility", "summary generation"]
    },
    {
      id: "platform-admin",
      name: "Platform Admin Bot",
      owner: "Platform Team",
      status: "Draft",
      template: "Platform Operations",
      purpose: "Oversees shared automation, guardrails, and common bot defaults.",
      users: [
        { name: "Platform Lead", role: "Owner" },
        { name: "Security Admin", role: "Reviewer" }
      ],
      skills: ["policy checks", "health review"],
      memory: ["platform runbooks"],
      permissions: ["admin configuration", "shared settings"]
    }
  ],
  departmentBots: [
    {
      id: "finance-bot",
      name: "Finance Bot",
      owner: "Finance Director",
      status: "Active",
      template: "Finance Operations",
      purpose: "Department-level bot for finance operations and reporting workflows.",
      users: [
        { name: "Finance Director", role: "Owner" },
        { name: "Controller", role: "Admin" },
        { name: "Ops Analyst", role: "Member" }
      ],
      skills: ["report prep", "variance review"],
      memory: ["monthly close notes", "control checklist"],
      permissions: ["finance data read", "propose actions"],
      children: [
        {
          id: "reconciliation-bot",
          name: "Reconciliation Bot",
          owner: "Controller",
          status: "Active",
          template: "Reconciliation Template",
          purpose: "Handles bank and account reconciliation workflows.",
          users: [
            { name: "Controller", role: "Owner" },
            { name: "Finance Manager", role: "Reviewer" }
          ],
          skills: ["matching", "exception flagging"],
          memory: ["recon exceptions"],
          permissions: ["statement read", "match proposal"]
        },
        {
          id: "reporting-bot",
          name: "Reporting Bot",
          owner: "Finance Manager",
          status: "Draft",
          template: "Reporting Template",
          purpose: "Supports monthly and board reporting preparation.",
          users: [
            { name: "Finance Manager", role: "Owner" },
            { name: "FP&A Lead", role: "Member" }
          ],
          skills: ["summary drafting", "variance commentary"],
          memory: ["board pack history"],
          permissions: ["report draft"]
        }
      ]
    },
    {
      id: "support-bot",
      name: "Support Bot",
      owner: "Head of Support",
      status: "Active",
      template: "Support Operations",
      purpose: "Department-level bot for customer support workflows.",
      users: [
        { name: "Head of Support", role: "Owner" },
        { name: "Escalation Manager", role: "Admin" }
      ],
      skills: ["triage", "routing"],
      memory: ["incident patterns", "kb guidance"],
      permissions: ["ticket read", "queue assignment"],
      children: [
        {
          id: "escalation-bot",
          name: "Escalation Bot",
          owner: "Escalation Manager",
          status: "Active",
          template: "Escalation Template",
          purpose: "Handles priority escalation workflows and internal handoffs.",
          users: [
            { name: "Escalation Manager", role: "Owner" },
            { name: "QA Reviewer", role: "Reviewer" }
          ],
          skills: ["priority tagging", "handoff summaries"],
          memory: ["escalation playbook"],
          permissions: ["priority adjust", "summary send"]
        }
      ]
    },
    {
      id: "engineering-bot",
      name: "Engineering Bot",
      owner: "VP Engineering",
      status: "Draft",
      template: "Engineering Operations",
      purpose: "Department-level bot for planning, execution, and review support.",
      users: [
        { name: "VP Engineering", role: "Owner" },
        { name: "Tech Lead", role: "Admin" }
      ],
      skills: ["planning", "review coordination"],
      memory: ["architecture notes"],
      permissions: ["repo read", "task creation"],
      children: []
    }
  ],
  botTemplates: [
    "Blank Bot",
    "Executive Coordination",
    "Finance Operations",
    "Support Operations",
    "Engineering Operations",
    "Reconciliation Template",
    "Reporting Template",
    "Escalation Template"
  ]
};
