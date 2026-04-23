# Linear Automation & PR Management Rules

## Purpose

This project uses automated Linear issue tracking. Claude MUST strictly follow the workflow to update issues, implement changes, create PRs, and sync everything back to Linear.

Automation is mandatory. Do NOT skip any step.

---

## Prerequisites

- Linear API key available in environment: `$env:LINEAR_API_KEY`
- GitHub CLI installed: `gh`
- Node.js v18+ available
- Linear update script path:
  `C:\Users\91858\.claude\linear-update.js`

---

## Workflow (STRICT ORDER)

### 1. Extract Issue ID

- Extract issue ID from user input
- Format: `PROJECT-NUMBER` (e.g., ENG-123)
- If missing, ask the user before proceeding

### Response if missing:

"Please provide a Linear issue ID (e.g., UI-5) to proceed."

- Do NOT fetch or list issues
- Do NOT guess issue IDs

---

### 2. Set Status → In Progress

node C:\Users\91858\.claude\linear-update.js "ISSUE_ID" "In Progress"

---

### 3. Create Branch

git checkout -b feature/ISSUE_ID-short-description

---

### 4. Implement Changes

- Complete the requested feature or fix
- Follow project conventions
- Add/update tests if applicable
- Follow Figma exactly if provided

---

### 5. Commit Changes

git add .
git commit -m "ISSUE_ID: concise description"

---

### 6. Push Branch

git push -u origin feature/ISSUE_ID-short-description

---

### 7. Create Pull Request

gh pr create --title "ISSUE_ID: Brief description" --body "## Summary`n`n[Description]`n`n## Changes Made`n- [Change 1]`n- [Change 2]`n`n## Testing`n- [Testing details]`n`n## Related Issue`nCloses ISSUE_ID`n`n## Checklist`n- [ ] Code follows guidelines`n- [ ] Tests added/updated`n- [ ] Documentation updated" --base main

---

### 8. Capture PR URL

- Extract PR URL from CLI output

---

### 9. Add PR Link to Linear

node C:\Users\91858\.claude\linear-update.js add-comment "ISSUE_ID" "PR created: PR_URL"

---

### 10. Set Status → Done

node C:\Users\91858\.claude\linear-update.js "ISSUE_ID" "Done"

---

## PR Rules

### Title Format

ISSUE_ID: Brief description

### PR Body Template

## Summary

[Explain what this PR does]

## Changes Made

- [Change 1]
- [Change 2]

## Testing

- [Testing steps/results]

## Related Issue

Closes ISSUE_ID

## Checklist

- [ ] Code follows project guidelines
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes

---

## Linear Status Values

- Todo
- In Progress
- In Review
- Done

---

## Failure Handling (MANDATORY)

If ANY step fails:

node C:\Users\91858\.claude\linear-update.js add-comment "ISSUE_ID" "❌ Automation failed at step: [STEP_NAME]. Error: [ERROR_MESSAGE]"

### Rules

- Do NOT mark the issue as Done
- Include step name and clear error message
- Stop execution immediately
- Notify the user AND Linear
- Always log failure before stopping

---

## Issue ID Enforcement Rule

- If the user request does NOT include a valid Linear issue ID, DO NOT proceed
- ALWAYS ask for the issue ID before taking any action
- Do NOT fetch or list issues
- Do NOT guess issue IDs
- Do NOT call Linear API without ISSUE_ID

---

## Output Efficiency Rule

- Respond with minimal output
- Do NOT explain actions unless explicitly asked
- Do NOT repeat issue details
- Do NOT summarize work unless requested
- Prefer short confirmations like:
  - "Done"
  - "PR created: <url>"
  - "Failed: <error>"

---

## Figma Execution Rule

- When a Figma design is provided:
  - Do NOT explain design decisions
  - Do NOT suggest alternatives
  - Do NOT ask for clarification unless blocked by missing data
  - Convert design directly into code

- Follow design exactly:
  - Layout
  - Spacing
  - Colors
  - Typography

- Default behavior:
  - Implement directly
  - Only ask questions if required information is missing

---

## Rules Summary (NON-NEGOTIABLE)

- ALWAYS update Linear status first
- ALWAYS create a branch
- ALWAYS include ISSUE_ID in commits and PR
- ALWAYS link PR back to Linear
- ALWAYS report failures to Linear
- NEVER skip steps
- NEVER guess issue IDs
