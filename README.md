# Velocity Motors — Car Dealership Inventory System

A full-stack **Car Dealership Inventory System** built as a TDD kata. Users
browse the showroom, filter cars, and purchase stock; admins add, edit,
delete and restock inventory. Backend is FastAPI + SQLite with JWT auth;
frontend is React + TypeScript + Tailwind. Backend logic is **test-driven**
with a visible **Red → Green → Refactor** commit history.

![Dashboard](docs/screenshots/dashboard.jpg)

---

## Tech stack

| Layer       | Choice                                     | Why                                                  |
| ----------- | ------------------------------------------ | ---------------------------------------------------- |
| Backend     | **FastAPI** 0.115 + SQLAlchemy 2.x         | Async-ready, zero-ceremony JWT, trivial pytest story |
| Database    | **SQLite** (default) / Postgres via `DATABASE_URL` | Fits the spec; swap env var for Postgres   |
| Auth        | **JWT** (`python-jose`) + `pbkdf2_sha256`  | No native bcrypt deps — ships on Vercel serverless   |
| Frontend    | **React 18 (JSX) + Vite + Tailwind**        | Per spec: HTML5 + CSS3 + Tailwind + React, no TS    |
| Tests       | **pytest** + **httpx TestClient**           | Fast, isolated per-test SQLite                       |
| Deployment  | **Vercel** (static frontend + Python API)   | Single-repo, zero-config                             |

---

## Features

### For buyers
- Register / log in (JWT, 24 h token).
- Live showroom with hero stats (listings / units / lot value).
- 5-field search: make, model, category, min/max price.
- Purchase a vehicle — button auto-disables when `quantity === 0`.

### For admins
- Everything above, plus:
- Add vehicle (modal + validated form).
- Edit any field inline.
- Restock (positive integer only — server rejects 0/negatives).
- Delete vehicle (admin-only, 403 for buyers).

![Edit modal](docs/screenshots/edit-modal.jpg)

---

## API

All vehicle routes require `Authorization: Bearer <jwt>`.

| Method | Path                              | Role  | Description                 |
| ------ | --------------------------------- | ----- | --------------------------- |
| POST   | `/api/auth/register`              | –     | Create user (optional admin)|
| POST   | `/api/auth/login`                 | –     | Returns JWT                 |
| GET    | `/api/vehicles`                   | user  | List all vehicles           |
| POST   | `/api/vehicles`                   | user  | Create vehicle              |
| GET    | `/api/vehicles/search?...`        | user  | Filter by make/model/category/min_price/max_price |
| PUT    | `/api/vehicles/{id}`              | user  | Update vehicle              |
| DELETE | `/api/vehicles/{id}`              | admin | Delete vehicle              |
| POST   | `/api/vehicles/{id}/purchase`     | user  | Decrement stock by 1        |
| POST   | `/api/vehicles/{id}/restock`      | admin | Add `amount` to stock       |

Interactive OpenAPI docs: `http://localhost:8000/docs`.

---

## Local setup

### Prereqs
- Python 3.11+
- Node 20+

### Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Backend is now at <http://localhost:8000>. OpenAPI at `/docs`.

### Frontend

```bash
cd frontend
npm install
npm run dev   # http://localhost:5173
```

The Vite dev server proxies `/api/*` to `http://localhost:8000` (see
`vite.config.ts`), so no CORS fiddling is needed in development.

### Run the tests

```bash
cd backend
.venv/bin/pytest --cov=app --cov-report=term
```

Expected: **23 passed, 96% coverage**. Full report in
[`docs/test-report.txt`](docs/test-report.txt).

---

## TDD process

Every backend feature was shipped in a **Red → Green → Refactor** triple.
Inspect:

```bash
git log --oneline
```

Example:

```
refactor(vehicles): extract service layer, slim routers to HTTP concerns [REFACTOR]
feat(inventory):    add /purchase and /restock endpoints [GREEN]
test(inventory,search): add tests for /purchase, /restock, and search [RED]
feat(vehicles):     CRUD endpoints with role-based delete guard [GREEN]
test(vehicles):     add failing tests for vehicle CRUD + auth guards [RED]
feat(auth):         implement register/login with JWT and pbkdf2 hashing [GREEN]
test(auth):         add failing tests for register/login endpoints [RED]
chore: scaffold FastAPI backend skeleton with SQLAlchemy models
```

---

## Deployment (Vercel)

The repo ships with a `vercel.json` that deploys **both** the React static
build and the FastAPI backend as serverless Python functions.

```bash
npm i -g vercel
vercel        # one-off, picks up vercel.json
vercel --prod
```

**Caveat about SQLite on serverless:** Vercel's Python runtime has an
ephemeral filesystem — the SQLite DB at `/tmp/dealership.db` resets on
every cold start. For a persistent demo, point `DATABASE_URL` at a free
Neon / Supabase Postgres (no code changes needed; SQLAlchemy handles it):

```
vercel env add DATABASE_URL
# paste: postgresql+psycopg://user:pass@host/db
```

### Deploying only the frontend

If you'd rather host the backend on Render / Fly / Railway (persistent
SQLite volume), build the frontend with a pointer to it:

```bash
cd frontend
VITE_API_BASE_URL=https://your-api.example.com/api npm run build
```

---

## Project layout

```
car_dealership_inventory_system/
├── api/                     # Vercel Python entry (re-exports backend app)
├── backend/
│   ├── app/
│   │   ├── core/            # config, db, security, deps
│   │   ├── models/          # SQLAlchemy: User, Vehicle
│   │   ├── schemas/         # pydantic DTOs
│   │   ├── services/        # vehicle business logic (service layer)
│   │   ├── routers/         # FastAPI routers (auth, vehicles)
│   │   └── main.py
│   └── tests/               # pytest suites
├── frontend/
│   └── src/
│       ├── components/      # Navbar, VehicleCard, VehicleForm, Modal
│       ├── context/         # AuthContext (JWT persisted in localStorage)
│       ├── pages/           # Login, Register, Dashboard
│       └── api.ts           # axios client w/ bearer interceptor
├── docs/
│   ├── screenshots/
│   └── test-report.txt
├── vercel.json
├── PROMPTS.md
└── README.md
```

---

## My AI Usage

I built this kata as a **pair-programming session with Claude Opus 4.7**
running inside the Claude Code CLI. All AI involvement is also recorded as
`Co-Authored-By:` trailers on the relevant commits.

### Tools used
- **Claude Opus 4.7** (via Claude Code / Claude Agent SDK) — the main
  pair programmer. Drove the end-to-end session: file edits, test runs,
  browser-based visual QA, commit crafting.
- **Vercel docs + FastAPI docs** — consulted directly, not through AI.

### Where I actually used it
1. **Project scaffolding.** I described the stack and Claude generated the
   initial directory layout, `requirements.txt`, Vite + Tailwind config,
   and the SQLAlchemy models. I reviewed and tightened the field types
   before committing.
2. **TDD test authoring (RED).** For each feature I brainstormed edge
   cases with Claude ("what should `/purchase` do when quantity is zero?
   What status code do we want?"), then let it write the initial failing
   tests. I pruned redundant cases and added role-guard assertions
   myself.
3. **Implementation (GREEN).** Claude wrote the first-cut router + service
   code so that the tests passed. I course-corrected on three things on my
   own: (a) switching from bcrypt to **pbkdf2_sha256** after hitting the
   passlib/bcrypt 4.x shim bug; (b) using `exclude_unset=True` in the
   update path so partial updates don't null missing fields; (c) deciding
   on `204 No Content` for DELETE instead of returning the deleted entity.
4. **Refactor pass.** I asked Claude to extract a `services/` layer and
   re-run the suite. The structural change (SRP: HTTP vs. domain logic)
   was mine; the mechanical move was AI.
5. **Frontend visual design.** Prompted Claude to iterate on the dark
   "garage" aesthetic — ink/accent/chrome palette, orange glow halos,
   grid-bg utility, Space Grotesk + Inter typography. Several color-token
   iterations before I was happy.
6. **Browser verification.** I used Claude's built-in browser pane to
   screenshot every important state (login, dashboard with "Sold out"
   disabled, edit modal) and spot visual regressions.
7. **README + commit messages.** Draft prose written by Claude; I edited
   for honesty (e.g. flagging the SQLite-on-Vercel caveat myself rather
   than letting it slide).

### Reflection
The TDD workflow is where AI pairing shines the hardest. Writing tests
first forced me to turn requirements into **concrete, measurable
assertions** before any implementation existed, which gave Claude an
unambiguous target — the model couldn't "cleverly" skip past my intent.
When I let it generate implementation without a test in place first
(e.g. an early attempt at the search handler), it tended to add
untested extras ("let me also add pagination"); the failing-test-first
cadence kept scope honest.

The biggest value-add was **velocity on boilerplate** (pydantic schemas,
Tailwind component classes, axios interceptors) and **catching myself**
when I was about to over-engineer (I was tempted to add a repository
layer on top of the service layer; Claude pushed back that it added no
behavior).

The biggest **anti-pattern** I had to resist: trusting the first green
run. A test that passes against AI-authored code and AI-authored tests
proves consistency, not correctness. I ran the SPA end-to-end in the
browser against a seeded DB for every router before considering a feature
"done" — the "Sold out" button state is in the test suite _and_ was
visually verified.

See [`PROMPTS.md`](PROMPTS.md) for the raw session transcript.

---

## License
MIT.
