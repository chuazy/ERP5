window.ERP5_CONFIG = {
  meta: {
    title: "ERP5 Bot Structure",
    subtitle: "Start from structure: super user bots on top, department bots below, then functional bots and single-workflow bots underneath.",
    company: "Enterprise Bot Workspace"
  },
  superUserBots: [
    {
      id: "exec-orchestrator",
      name: "Executive Orchestrator",
      level: "super",
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
      level: "super",
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
      level: "department",
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
      functionalBots: [
        {
          id: "reconciliation-function",
          name: "Reconciliation Bot",
          level: "functional",
          owner: "Controller",
          status: "Active",
          template: "Reconciliation Template",
          purpose: "Owns reconciliation as a stable finance function.",
          users: [
            { name: "Controller", role: "Owner" },
            { name: "Finance Manager", role: "Reviewer" }
          ],
          skills: ["matching", "exception flagging"],
          memory: ["recon exceptions"],
          permissions: ["statement read", "match proposal"],
          workflowBots: [
            {
              id: "bank-recon-workflow",
              name: "Bank Reconciliation Workflow Bot",
              level: "workflow",
              owner: "Controller",
              status: "Active",
              template: "Workflow Template",
              purpose: "Runs the bank reconciliation workflow for a defined cycle.",
              users: [
                { name: "Controller", role: "Owner" },
                { name: "Ops Analyst", role: "Member" }
              ],
              skills: ["statement matching"],
              memory: ["recon run logs"],
              permissions: ["workflow execution"]
            }
          ]
        },
        {
          id: "reporting-function",
          name: "Reporting Bot",
          level: "functional",
          owner: "Finance Manager",
          status: "Draft",
          template: "Reporting Template",
          purpose: "Owns finance reporting as a stable function.",
          users: [
            { name: "Finance Manager", role: "Owner" },
            { name: "FP&A Lead", role: "Member" }
          ],
          skills: ["summary drafting", "variance commentary"],
          memory: ["board pack history"],
          permissions: ["report drafting"],
          workflowBots: [
            {
              id: "board-pack-workflow",
              name: "Board Pack Workflow Bot",
              level: "workflow",
              owner: "Finance Manager",
              status: "Draft",
              template: "Workflow Template",
              purpose: "Produces the monthly board pack workflow output.",
              users: [
                { name: "Finance Manager", role: "Owner" },
                { name: "FP&A Analyst", role: "Member" }
              ],
              skills: ["board pack prep"],
              memory: ["prior board packs"],
              permissions: ["workflow draft"]
            },
            {
              id: "variance-commentary-workflow",
              name: "Variance Commentary Workflow Bot",
              level: "workflow",
              owner: "FP&A Lead",
              status: "Draft",
              template: "Workflow Template",
              purpose: "Generates variance commentary workflow outputs.",
              users: [
                { name: "FP&A Lead", role: "Owner" }
              ],
              skills: ["variance narrative"],
              memory: ["commentary examples"],
              permissions: ["workflow draft"]
            }
          ]
        }
      ]
    },
    {
      id: "support-bot",
      name: "Support Bot",
      level: "department",
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
      functionalBots: [
        {
          id: "escalation-function",
          name: "Escalation Bot",
          level: "functional",
          owner: "Escalation Manager",
          status: "Active",
          template: "Escalation Template",
          purpose: "Owns escalation handling as a stable support function.",
          users: [
            { name: "Escalation Manager", role: "Owner" },
            { name: "QA Reviewer", role: "Reviewer" }
          ],
          skills: ["priority tagging", "handoff summaries"],
          memory: ["escalation playbook"],
          permissions: ["priority adjust", "summary send"],
          workflowBots: [
            {
              id: "vip-escalation-workflow",
              name: "VIP Escalation Workflow Bot",
              level: "workflow",
              owner: "Escalation Manager",
              status: "Active",
              template: "Workflow Template",
              purpose: "Runs VIP customer escalation workflow handling.",
              users: [
                { name: "Escalation Manager", role: "Owner" }
              ],
              skills: ["vip routing"],
              memory: ["vip cases"],
              permissions: ["workflow execution"]
            }
          ]
        }
      ]
    },
    {
      id: "engineering-bot",
      name: "Engineering Bot",
      level: "department",
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
      functionalBots: [
        {
          id: "review-function",
          name: "Review Bot",
          level: "functional",
          owner: "Tech Lead",
          status: "Draft",
          template: "Code Review Template",
          purpose: "Owns engineering review workflows.",
          users: [
            { name: "Tech Lead", role: "Owner" }
          ],
          skills: ["review coordination"],
          memory: ["review checklist"],
          permissions: ["repo read"],
          workflowBots: []
        }
      ]
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
    "Escalation Template",
    "Workflow Template",
    "Code Review Template"
  ]
};
