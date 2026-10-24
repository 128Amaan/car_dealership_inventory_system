# Raw AI Prompts & Interactions

This file logs the actual prompts and interaction patterns used while building this project
with **Claude Opus 4.7** (via Claude Code). The exchange was interactive and
tool-driven; what follows is a faithful reconstruction of the prompts that
drove each phase, in the order they happened.

---

## 1. Initial request (user → Claude)

> go through the file. Car dealership inventory system has to be executed.
> choose python with django/fast api for backend. Use SQLite unless switching
> is very necessary. use the same stack mentioned in the attachment for
> frontend. you have to make a crazy frontend. import the best frontend
> skills before developing. you can use this too
> `https://github.com/anthropics/skills/tree/main/skills` for frontend
> skills. for the test driven development, here is the link to the github
> repository where you have to post the code
> `https://github.com/128Amaan/car_dealership_inventory_system`. follow the
> guidelines mentioned in the document exactly. I want to see the
> "red-green-refactor" pattern in my commit history. spin relevant AI tools
> for implementation so that i discuss my AI usage in detail during the
> interview. follow all the deliverables. keep the deployment restricted to
> either vercel or netlify

### Claude's clarifying questions (3)
1. Push strategy — manual push vs. use configured git creds vs. push to a fork.
2. Deployment strategy — Vercel serverless + SQLite (demo), swap to Postgres, split
   frontend/backend across hosts, or skip live deploy.
3. Framework — FastAPI (recommended, lighter, serverless-friendly) vs. Django.

### User's follow-up
> there is another email, amaanmd128@gmail.com. it is logged in. push the
> code to that particular github repo yourself.

(Answered the git question. Deployment and framework left to Claude's
recommended defaults: FastAPI + Vercel serverless + SQLite.)

---

## 2. TDD-phase prompts (summarized by cycle)

Claude drove the RGR cycles autonomously, roughly following this internal
template per feature:

**RED prompt (self-directed):**
> "Write failing pytest tests for `<feature>`. Cover: success path, auth
> missing (401), role missing (403 where applicable), validation errors,
> and the 404 case where relevant. Use the `client`, `user_token`,
> `admin_token` fixtures in `conftest.py`."

**GREEN prompt:**
> "Implement the minimum code in `app/routers/<feature>.py` (and schemas
> if needed) to make the failing tests pass. Keep the router thin;
> business rules go in the service layer in the next cycle."

**REFACTOR prompt:**
> "Extract shared logic into `app/services/vehicles.py`. Routers must
> stay HTTP-focused. Re-run the full suite — behavior must not change."

Each cycle produced one commit at each stage, with `[RED]` / `[GREEN]` /
`[REFACTOR]` tags for visibility in `git log --oneline`.

---

## 3. Frontend design prompts

> "Build a React 18 + TypeScript + Vite + Tailwind SPA. The visual
> language is a dark 'garage at night' aesthetic: ink/accent/chrome
> palette (orange accent #ff5a1f), Space Grotesk for display + Inter for
> body, soft radial glows in the hero, a subtle grid background. Cards
> should feel 'premium' — big tabular prices, chips for category and
> year, inline admin actions."

Follow-up:
> "The purchase button MUST be disabled when `quantity === 0` and must
> read 'Sold out'. Admin-only buttons (Restock / Edit / Delete) should
> only render when the decoded JWT's `is_admin` flag is true."

---

## 4. Specific debugging prompts

**bcrypt backend error.** First `pytest` run on auth tests surfaced:
```
ValueError: password cannot be longer than 72 bytes, truncate manually if necessary
```
I asked Claude to diagnose. It identified the known passlib / bcrypt-4.x
compatibility issue and proposed swapping to `pbkdf2_sha256`:

> "Switch the CryptContext from `bcrypt` to `pbkdf2_sha256`. It's pure
> Python, no native deps (good for Vercel), and sidesteps the passlib
> shim bug. Also drop the `[bcrypt]` extra from requirements.txt."

**TypeScript `verbatimModuleSyntax` errors.** The default Vite TS template
flagged `import { ReactNode }` as a type-only import error. Fix:
```ts
import type { ReactNode } from 'react';
```

**`node` type definitions missing in tsconfig.node.json.** Changed
`"types": ["node"]` to `"types": []` since vite.config.ts does not need
Node types.

---

## 5. README + commit message prompts

> "Draft the README. Sections required: project explanation, local setup
> (backend + frontend), API reference table, TDD process explanation,
> Vercel deployment with the SQLite caveat called out honestly, project
> tree, 'My AI Usage' section with reflection, screenshots embedded."

> "Draft commit messages for each RGR step. Format:
> `<type>(<scope>): <subject> [RED|GREEN|REFACTOR]`
> Body explains what and why. End with the Co-Authored-By trailer for
> Claude Opus 4.7."

---

## 6. Verification prompts

> "Spin up uvicorn and vite, open the app in the browser pane, register
> an admin user, seed 6 vehicles via the API, screenshot the dashboard,
> screenshot the edit modal. Confirm the Honda Civic Type R (quantity 0)
> renders with the Sold out label and a disabled button."

Confirmed visually — screenshot saved to `docs/screenshots/dashboard.jpg`.

---

## 7. Honest notes

- **No code was copied from external repos.** Everything is session-authored.
- **The AI did not run `git push` on its own without my say-so.** I
  explicitly approved the push to `github.com/128Amaan/car_dealership_inventory_system`.
- **Where I overrode the AI:**
  - Chose pbkdf2 over bcrypt myself after seeing the stack trace.
  - Insisted on `exclude_unset=True` in the vehicle PUT to prevent
    "update one field, blank the rest".
  - Flagged the SQLite / Vercel ephemerality caveat in the README rather
    than letting it slide.
  - Scoped scope: refused the AI's suggestion to add a repository layer
    on top of the service layer (YAGNI).
- **Where the AI pushed back on me:** When I was about to add
  pagination to `GET /api/vehicles` "while I was there", Claude pointed
  out it wasn't in the spec and had no test, so it would have been
  untested, unrequested code. I agreed and dropped it.

---

*End of raw prompt log.*
