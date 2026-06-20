# Agent Marketplace — AGENT DESIGN

General patterns: AGENT_GUIDE.md. The marketplace **distributes** agents; its own internal agent surface is minimal.

## The product distributes agents
"Agent design" here = the **listing contract** for a publishable agent: manifest (capabilities, required tools/permissions, model, guardrails config), runtime (runs via ContextOS #1 agent runtime), observability (via #4), and trust metadata (security review, ratings). A listed agent must declare its tools/permissions for safe install.

## Internal agents (minimal)
| Agent | Job | Autonomy |
|-------|-----|----------|
| Review-assist | Pre-screen submissions for security/quality | None (workflow; human approves) |
| Discovery/recommend | Match intent → listings | None (search) |

Workflows, not autonomous agents.

## Installed-agent safety (the real design)
When a consumer installs an agent, it runs in *their* ContextOS (#1) with:
- Least-privilege tool/permission scopes (declared in the manifest, consumer-approved).
- Sandboxed execution; HITL gates on destructive tools.
- Observability + cost tracking via #4.
- Guardrails inherited from #1 (injection defense, etc.).
So marketplace agents are as safe as the platform's own — the marketplace just adds review + ratings + permission disclosure.

## Guardrails
Permission disclosure pre-install; security review (reuse #3 lint); sandboxed runtime; consumer approves scopes; takedown for malicious listings. See [GUARDRAILS.md](./GUARDRAILS.md).
