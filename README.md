# KaamSaathi

> **Your Work, Your Rights, Your Companion**

KaamSaathi is a multilingual web application concept built to support India's gig workers, delivery partners, drivers, and daily-wage workers. It brings everyday work tools and helpful starting points together: track what you earn and spend, find official worker-resource portals, ask for simple explanations, and prepare a workplace complaint letter.

The product is designed around a simple idea: workers should be able to understand their work and options without having to navigate a complicated interface. Its dark, mobile-friendly workspace uses a calm visual style, plain language, and clear notes about what is demo content, what comes from an AI service, and where official information should be checked.

## At a glance

- **Frontend:** React, JavaScript, Vite, Tailwind CSS, React Router, Framer Motion, Lucide React, Recharts
- **Backend:** Node.js, Express, REST API
- **Database:** PostgreSQL with Prisma ORM; Neon PostgreSQL is supported
- **Authentication:** bcrypt password hashing and signed JWTs stored in HTTP-only cookies
- **AI:** Gemini API through the backend; the key stays in the backend environment
- **Languages:** English, Hindi, and Punjabi in the assistant interface

## Features

### Dashboard

The dashboard greets the signed-in worker, summarizes recorded income and expenses, calculates take-home earnings, plots a seven-day money chart, and surfaces shortcuts to common tasks. Its totals come from the worker's transaction records.

### Earnings tracker

- Add income and expense entries with an amount, category, date, and optional note.
- See totals for earned, spent, and net earnings.
- Filter the ledger by all transactions, income, or expenses.
- Remove entries and export records as a CSV file.
- Keep transactions associated with the account that created them.

### AI Saathi

The assistant accepts questions in English, Hindi, or Punjabi, and can give plain-language general guidance about work and records. With `GEMINI_API_KEY` configured, messages are sent through the backend to Gemini. Without a key, the app uses clearly identified demo guidance instead of claiming a live AI response.

AI output may be incomplete or incorrect. Treat it as a starting point, not a legal, financial, or emergency service. Do not send sensitive personal information.

### Government schemes and support

Search and filter a directory of worker-related starting points, with links to official portals including e-Shram, Maandhan, myScheme, PM SVANidhi, Skill India Digital Hub, and the Apprenticeship Training Portal. The app intentionally directs people to those official sources instead of claiming to verify their personal eligibility or promising benefits.

### Safety and rights

Read practical, general safety reminders and follow links to official or established resources, including India's 112 emergency information, e-Shram, and NALSA. For urgent danger, contact local emergency services. Workplace rights and remedies depend on individual circumstances and current local rules; seek qualified local advice.

### Document assistant

Provide plain text from a document to request a simpler explanation. The interface supports `.txt` and `.md` file selection or pasted text, and reminds users to remove personal identifiers first. The backend sends submitted text to Gemini only when configured. In demo mode, the app explains that it did not perform a real AI analysis.

Only submit text that you are comfortable sending to the configured AI provider. The service does not persist uploaded files, but submitted text is included in the AI request when that service is enabled.

### Complaint-letter helper

Prepare a structured letter for issues such as missing payments, deductions, account deactivation, or workplace safety. The generated template is editable, can be saved to the signed-in account, reopened, updated, deleted, and downloaded as plain text. It helps organize user-provided facts; it does not file or send the complaint, and it is not legal advice.

### Accounts and privacy

Create an account, sign in, view the authenticated profile, and sign out. Passwords are hashed with bcrypt. Authentication uses a signed JWT in an HTTP-only, SameSite cookie. Protected API operations filter database records by the authenticated user.

### Demo mode

Choose **Explore the demo** on the sign-in page to explore without the API or a database account. Demo profile and sample records are stored in browser local storage on that device. They are not sent to Neon, do not represent a real signed-in account, and are separate from backend records.

## Project structure

```text
Projects/
├── frontend/                 # React and Vite application
│   ├── src/
│   └── .env.example
├── backend/                  # Express REST API
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── src/
│   ├── test/
│   └── .env.example
└── README.md
```

The frontend and backend are separate applications and run in separate terminals during development.

## Run locally

### Requirements

- Node.js 20 or newer
- npm
- A PostgreSQL database, either local PostgreSQL or Neon
- A Gemini API key only if you want to try live AI responses

### 1. Configure the backend

Open a terminal in the backend directory:

```powershell
cd D:\Projects\backend
Copy-Item .env.example .env
```

Edit `backend/.env` and set:

- `DATABASE_URL` — PostgreSQL runtime connection string.
- `DIRECT_URL` — direct PostgreSQL connection string for migrations.
- `JWT_SECRET` — a private, random secret of at least 32 characters.
- `FRONTEND_URL` — for local development, `http://localhost:5173`.
- `GEMINI_API_KEY` — optional; keep it only in the backend `.env`.

Generate a suitable JWT secret with:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Do not put database credentials, JWT secrets, or Gemini API keys in frontend environment files, source code, screenshots, or version control. The repository ignores local `.env` files.

### 2. Configure Neon (or local PostgreSQL)

Neon is PostgreSQL-compatible, so no application code change is needed.

For Neon:

1. Create or choose a Neon project and database.
2. Copy the **pooled** connection string into `DATABASE_URL`.
3. Copy the **direct/unpooled** connection string for the same database into `DIRECT_URL`.
4. Keep Neon’s SSL requirement, usually `sslmode=require`.

Use the connection string for the database you actually intend to use. If you change database URLs, Prisma will target that database when migrations run.

For local PostgreSQL, use the same database URL for both variables if your local setup does not use a pooler.

### 3. Install dependencies and initialize the database

Still in `D:\Projects\backend`, run:

```powershell
npm.cmd install
npx prisma migrate deploy
npx prisma generate
```

`migrate deploy` creates or updates the tables in the configured database. You need to run it when setting up a database or applying new migrations—not every time you start the app.

### 4. Start the backend

In the backend terminal:

```powershell
npm.cmd run dev
```

Keep the terminal open. The API listens on port `4000` by default. Check:

```text
http://localhost:4000/api/health
```

Expected response:

```json
{"status":"ok"}
```

### 5. Start the frontend

Open a **second** terminal:

```powershell
cd D:\Projects\frontend
npm.cmd install
npm.cmd run dev
```

Open the Vite URL printed in that terminal, usually `http://localhost:5173`. Use the same local origin configured in `FRONTEND_URL`; the frontend development server proxies `/api` to `http://localhost:4000`.

On Windows PowerShell, `npm.cmd` avoids execution-policy errors that can occur with the `npm.ps1` shim. In Command Prompt, `npm` may work normally.

### 6. Test the real application

1. Ensure both backend and frontend terminals are still running.
2. Open `http://localhost:5173`.
3. If you are in demo mode, sign out, reload, and choose **Create an account** to register through the API.
4. Add income and expense entries, refresh the page, and confirm the entries remain.
5. Export the ledger to CSV.
6. Create and save a complaint draft, refresh, and confirm it remains available.
7. Ask AI Saathi a basic question. A configured Gemini key enables a live request; without one, the assistant returns clearly identified demo guidance.
8. Try document explanation with non-sensitive sample text. Remove names, account numbers, identity numbers, and other sensitive details before submitting.

To inspect database rows during development:

```powershell
cd D:\Projects\backend
npx prisma studio
```

Prisma Studio connects to the database configured in `backend/.env`. Be careful when viewing or editing real user records.

## Environment variables

See [`backend/.env.example`](./backend/.env.example) and [`frontend/.env.example`](./frontend/.env.example).

Backend:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL application connection; use Neon’s pooled URL when appropriate. |
| `DIRECT_URL` | Direct PostgreSQL connection used by Prisma for migrations. |
| `JWT_SECRET` | Private signing secret; use a long, random value. |
| `FRONTEND_URL` | Allowed frontend origin for credentialed API requests. |
| `PORT` | API port; defaults to `4000`. |
| `GEMINI_API_KEY` | Optional private Gemini credential. Leave blank for demo AI responses. |
| `GEMINI_MODEL` | Gemini model name used by the backend; defaults to `gemini-flash-latest`. |
| `COOKIE_SECURE` | Set to `true` when serving over HTTPS in production. |

Frontend:

| Variable | Purpose |
| --- | --- |
| `VITE_API_URL` | Optional API base URL when the frontend is not using the Vite `/api` proxy. |

## API routes

| Method | Route | Purpose | Authentication |
| --- | --- | --- | --- |
| `GET` | `/api/health` | Check API availability. | No |
| `POST` | `/api/auth/register` | Create an account. | No |
| `POST` | `/api/auth/login` | Sign in and issue a session cookie. | No |
| `POST` | `/api/auth/logout` | Clear the session cookie. | No |
| `GET` | `/api/auth/me` | Get the signed-in profile. | Yes |
| `GET`, `POST` | `/api/transactions` | List or create the user's transactions. | Yes |
| `DELETE` | `/api/transactions/:id` | Delete a transaction owned by the user. | Yes |
| `GET`, `POST` | `/api/complaints` | List or create the user's complaint drafts. | Yes |
| `PUT`, `DELETE` | `/api/complaints/:id` | Update or delete an owned complaint draft. | Yes |
| `POST` | `/api/assistant/chat` | Request an assistant response. | Yes |
| `POST` | `/api/assistant/document` | Request a document-text explanation. | Yes |

## Checks

Run these from the relevant project folder:

```powershell
# Backend API smoke tests
cd D:\Projects\backend
npm.cmd test

# Backend JavaScript syntax check
npm.cmd run build

# Frontend production build
cd D:\Projects\frontend
npm.cmd run build
```

## Security and responsible use

- Passwords are hashed; authentication cookies are HTTP-only and SameSite.
- Protected transaction and complaint operations scope database queries to the authenticated user.
- The API uses Helmet, CORS allowlisting, request rate limiting, input validation, and bounded JSON request sizes.
- Use HTTPS and set `COOKIE_SECURE=true` when deployed.
- Keep secrets in backend environment variables and rotate them if exposed.
- Never treat generated AI text as authoritative legal, financial, safety, or eligibility advice.
- Verify scheme rules and applications on the linked official government portals.
- KaamSaathi is an independent application, not a government service. It does not submit scheme applications or send complaints on the user's behalf.

## Current scope and limitations

- Scheme information is a concise directory of official links, not a live government eligibility checker.
- The complaint helper prepares a letter for the user to review; it does not submit or send it.
- Demo AI is illustrative and is not a real Gemini response.
- AI requests depend on network availability, API credentials, provider availability, and the provider's terms.
- The application is a development-stage project. Review operations, privacy notices, deployment settings, and applicable legal requirements before launching it to real users.
