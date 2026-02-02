# Agent Prompt Verification & Data Audit

**Date**: 2026-02-01
**Auditor**: Pickle Rick

## 1. Executive Summary
A systematic audit of 10 agent triggers was conducted using a mock data context.
- **Success Rate**: ~30% (3/10 functioning as intended).
- **Major Issue**: Agents "hallucinate" tool execution (writing pseudo-code) or regurgitate their system prompt instructions because the backend logic (`route.js`) does not actually execute the requested tools for most triggers.
- **Data Integrity**: Jarvis correctly identified "Headcount: 2" from the summarized context, proving the `summarizeContext` fix works.

## 2. Detailed Findings

### A. Jarvis (The Orchestrator)
| Trigger | Status | Finding |
| :--- | :--- | :--- |
| `#desk-pulse` | ✅ **PASS** | Correctly read "2 Active" from context. |
| `#crisis-interceptor` | ❌ **FAIL** | Hallucinates "Initiating protocol" but returns no data. No backend tool exists. |
| `#rainmaker` | ⚠️ **PARTIAL** | Ignores the `riskReport` injected into the prompt and tries to "plan" a weather check. |
| `#audit-desk` | ❌ **FAIL** | Regurgitates prompt instructions. No backend tool. |
| `#strategic-report` | ❌ **FAIL** | Regurgitates prompt instructions. No backend tool. |
| `#client-demand` | ❌ **FAIL** | Regurgitates prompt instructions. No backend tool. |
| `#migrant-workforce` | ❌ **FAIL** | Returns mock/placeholder text. |

### B. Negotiator
| Trigger | Status | Finding |
| :--- | :--- | :--- |
| `#rate-defense` | ✅ **PASS** | Generates a valid script based on the input. Pure LLM task. |

### C. Compliance
| Trigger | Status | Finding |
| :--- | :--- | :--- |
| `#visa-check` | ⚠️ **WEAK** | Asks user for details instead of scanning the provided `context.candidates` list. |

### D. Scout
| Trigger | Status | Finding |
| :--- | :--- | :--- |
| `find [role]` | ⚠️ **SUSPICIOUS** | Returns a generic table that looks hallucinated. Needs verification of `scoutBench` tool. |

## 3. Root Cause Analysis
1.  **Missing "Action" Logic**: `app/api/agent/route.js` only handles `RELATIONSHIP_HEALTH` and `PULSE_METRICS`. It does **not** check for `#audit-desk` or other triggers to run corresponding `logic-hub.js` tools.
2.  **Passive Prompts**: The Compliance agent is prompted to "Review... if < 30 days". It interprets this as "Wait for input" rather than "Scan the JSON I already have".

## 4. Recommendations
1.  **Connect the Tools**: Update `route.js` to map triggers (e.g., `#audit-desk`) to `runProtocol` calls.
2.  **Force Active Scan**: Update Compliance and Scout prompts to explicitly say "SCAN THE CONTEXT JSON NOW".
