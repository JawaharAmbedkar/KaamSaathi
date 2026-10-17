# 🤝 KaamSaathi
### Your Work. Your Rights. Your Companion.

**An AI-powered multilingual companion empowering India's gig workers and daily-wage workers with smarter earnings management, accessible information, and workplace support.**

KaamSaathi helps delivery partners, drivers, and informal workers manage their work more easily through AI-powered assistance, earnings tracking, official worker resources, document explanations, and complaint drafting — all in one simple, accessible platform.

<p align="center">
  <strong>Built with ❤️ for the people who keep India moving.</strong>
</p>

---

## 📌 About the Project

Millions of workers rely on daily earnings but often face challenges understanding their finances, finding relevant government resources, navigating documents, and raising workplace concerns.

**KaamSaathi aims to make these everyday tasks simpler.**

Designed with a clean, mobile-friendly interface and multilingual AI assistance, KaamSaathi brings essential tools together in one place. Its goal is to make useful information easier to understand and everyday work management less stressful.

## ✨ Features

### 📊 Smart Earnings Tracker
- Record daily income and expenses.
- Categorize transactions and add notes.
- Calculate total earnings, expenses, and net earnings.
- Visualize financial trends with interactive charts.
- Filter transactions and export records to CSV.
- Keep personal financial records associated with the account that created them.

### 🤖 AI Saathi — Your Personal AI Assistant
- Ask questions in English, Hindi, and Punjabi.
- Get simple explanations and practical guidance.
- Understand workplace-related information more easily.
- Receive AI-powered assistance through the Gemini API.
- Use clearly labeled demo responses when live AI is not configured.

### 🏛️ Government Schemes & Worker Resources
- Discover useful worker-resource portals.
- Access official websites for registration, employment, and welfare information.
- Explore resources such as e-Shram, Maandhan, and National Career Service.
- Find starting points for researching benefits and eligibility.

### 🛡️ Safety & Workers' Rights
- Explore practical workplace and road safety guidance.
- Find useful worker-support resources.
- Access established legal-aid and emergency information sources.
- Understand where to seek additional help.

### 📄 AI Document Assistant
- Submit text from a document for a simpler explanation.
- Understand difficult terminology.
- Request plain-language summaries and translations.
- Receive assistance through the configured AI service.

### 📝 Complaint Letter Generator
- Prepare letters for missing payments, unfair deductions, account deactivation, and workplace concerns.
- Generate structured complaint drafts using user-provided information.
- Edit, save, reopen, and delete drafts.
- Download complaint letters as plain text.

### 🔐 Secure Authentication
- User registration and login.
- Secure password hashing with bcrypt.
- JWT-based authentication using HTTP-only cookies.
- Protected API endpoints.
- User-specific records and access controls.

### 🎨 Modern User Experience
- Premium dark-themed interface.
- Emerald-green accents and subtle glassmorphism.
- Smooth animations and interactive elements.
- Responsive layouts for desktop and mobile.
- Clean navigation and intuitive workflows.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React | Frontend user interface |
| JavaScript | Application logic |
| Vite | Frontend development and build tooling |
| Tailwind CSS | Responsive styling and UI design |
| React Router | Client-side navigation |
| Framer Motion | Animations and transitions |
| Lucide React | Icons |
| Recharts | Earnings visualizations |
| Node.js | Backend runtime |
| Express.js | REST API and server-side logic |
| PostgreSQL | Relational database engine |
| Neon | Serverless PostgreSQL database hosting |
| Prisma ORM | Database access, schema management, and migrations |
| bcrypt | Password hashing |
| JWT | Authentication |
| Gemini API | AI-powered assistance |

---

## 🏗️ Project Architecture

KaamSaathi uses a separated frontend and backend architecture.

```text
kaamsaathi/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── .env.example
│   └── package.json
│
├── backend/
│   ├── src/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── test/
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

**Frontend:** Handles the user interface, navigation, forms, charts, and API communication.

**Backend:** Handles authentication, business logic, database operations, AI integrations, validation, and protected resources.

**Database:** Neon hosts the PostgreSQL database, while Prisma manages database queries and migrations.

---

## 🗄️ Database — Neon PostgreSQL

KaamSaathi uses **[Neon](https://neon.tech/)** as its cloud database platform.

Neon provides managed, serverless PostgreSQL, allowing the application to store and retrieve data without requiring a self-managed database server.

### How the database works

- **Neon PostgreSQL:** Stores application data, including user accounts, earnings transactions, and saved complaint drafts.
- **Prisma ORM:** Connects the Express backend to the database and provides structured database queries.
- **Database migrations:** Keep the database schema synchronized with Prisma models.
- **Connection pooling:** Neon's pooled connection string can help manage database connections efficiently.
- **Environment configuration:** Database credentials remain on the backend and are never exposed to the browser.

### Database Architecture

```text
React Frontend
      │
      ▼
Express.js REST API
      │
      ▼
Prisma ORM
      │
      ▼
Neon PostgreSQL
      │
      ├── User Accounts
      ├── Earnings & Expenses
      └── Complaint Drafts
```

The frontend communicates with the Express backend, which performs database operations through Prisma. Protected operations must verify authentication and enforce record ownership.

### Why Neon?

- Cloud-hosted PostgreSQL without managing your own database server.
- PostgreSQL compatibility with familiar SQL tools and libraries.
- Pooled connections for suitable application workloads.
- Integration with Prisma and Node.js.
- A convenient database hosting option for development and deployment.

Learn more: [Neon Documentation](https://neon.tech/docs)

---

## ⚙️ Getting Started

Follow these steps to run KaamSaathi locally.

### Prerequisites

Make sure you have installed:

- [Node.js 20 or newer](https://nodejs.org/)
- npm
- A [Neon PostgreSQL](https://neon.tech/) account or another PostgreSQL instance
- A Gemini API key for live AI functionality (optional)

### 1. Clone the Repository

```bash
git clone YOUR_REPOSITORY_URL
cd kaamsaathi
```

Replace `YOUR_REPOSITORY_URL` with your actual GitHub repository URL.

### 2. Configure the Backend

```bash
cd backend
npm install
```

Create a local environment file by copying `.env.example` to `.env`.

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Configure the following variables in `backend/.env`:

```env
DATABASE_URL="your_neon_pooled_connection_string"
DIRECT_URL="your_neon_direct_connection_string"

JWT_SECRET="your_long_random_secret"
FRONTEND_URL="http://localhost:5173"
PORT=4000

GEMINI_API_KEY=""
GEMINI_MODEL="your_supported_gemini_model"

COOKIE_SECURE=false
```

**Important:**

- `DATABASE_URL` should contain the pooled Neon connection string when using Neon's connection pooler.
- `DIRECT_URL` should contain the direct, unpooled connection string for the same database if your Prisma setup uses it for migrations.
- `JWT_SECRET` must be a long, random, private value.
- `GEMINI_API_KEY` is optional if you want to use demo responses instead of live AI.

Use the exact variable names expected by your Prisma schema and backend configuration.

### 3. Initialize the Database

From the `backend` directory, run:

```bash
npx prisma migrate deploy
npx prisma generate
```

Prisma applies the existing migrations to your configured Neon database and generates the Prisma client.

Make sure your connection strings point to the intended database before running migrations.

### 4. Start the Backend

```bash
npm run dev
```

The backend runs on port `4000` by default.

Check the health endpoint:

**http://localhost:4000/api/health**

A successful response looks like:

```json
{
  "status": "ok"
}
```

### 5. Start the Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL provided by Vite, usually:

**http://localhost:5173**

If the frontend uses a Vite `/api` proxy, requests are forwarded to the backend running on port `4000`.

### 6. Enable Live AI (Optional)

Add a valid Gemini API key to `backend/.env`:

```env
GEMINI_API_KEY="your_actual_api_key"
GEMINI_MODEL="your_supported_gemini_model"
```

Restart the backend after updating the environment variables.

Without a configured API key, the application uses clearly identified demo responses where supported.

---

## 🔌 API Overview

The backend exposes REST API endpoints for the application's core workflows.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Check API status |
| POST | `/api/auth/register` | Register an account |
| POST | `/api/auth/login` | Authenticate a user |
| POST | `/api/auth/logout` | End the session |
| GET | `/api/auth/me` | Get the authenticated profile |
| GET | `/api/transactions` | Retrieve transactions |
| POST | `/api/transactions` | Create a transaction |
| DELETE | `/api/transactions/:id` | Delete an owned transaction |
| GET | `/api/complaints` | Retrieve saved complaint drafts |
| POST | `/api/complaints` | Create a complaint draft |
| PUT | `/api/complaints/:id` | Update a complaint draft |
| DELETE | `/api/complaints/:id` | Delete a complaint draft |
| POST | `/api/assistant/chat` | Request AI assistance |
| POST | `/api/assistant/document` | Request document-text explanation |

Authenticated endpoints require a valid session. Protected operations must enforce user ownership so users cannot access another user's private records.

Refer to the backend implementation for the exact request bodies, validation rules, and response formats.

---

## 🔒 Security & Privacy

KaamSaathi incorporates security measures designed to protect user accounts and records:

- Passwords are hashed using bcrypt.
- Authentication uses signed JWTs in HTTP-only cookies.
- Protected operations are scoped to the authenticated user.
- The backend uses Helmet, CORS allowlisting, rate limiting, and request validation.
- Sensitive configuration is stored in environment variables.
- Uploaded documents and submitted text must be handled carefully.

**Security best practices:**

- Never commit API keys, database credentials, JWT secrets, or real user data to GitHub.
- Use HTTPS and configure secure cookies before production deployment.
- Restrict CORS to trusted frontend origins.
- Verify ownership before reading, modifying, or deleting private records.
- Avoid submitting sensitive personal information to AI services.

Review the implementation and production configuration before describing any security control as fully enforced.

---

## 🧪 Testing

Run backend tests from the `backend` directory:

```bash
npm test
```

Run the configured backend build or validation script:

```bash
npm run build
```

Build the frontend for production:

```bash
cd frontend
npm run build
```

Verify that the relevant scripts exist in each `package.json`.

Before deployment, test authentication, transaction persistence, user ownership, complaint drafting, AI provider failures, and responsive layouts.

---

## 🌱 Future Improvements

Potential areas for further development include:

- 🎙️ Voice-based AI assistance for workers with limited literacy.
- 🌐 More Indian languages and regional-language support.
- 🏛️ Verified and regularly updated government scheme information.
- 🎯 Personalized benefit discovery.
- 📶 Offline-friendly workflows for unreliable internet connections.
- 📱 Progressive Web App (PWA) support.
- 📄 Improved document OCR and multilingual document processing.
- 🛡️ Additional worker-safety resources and location-aware support.

---

## 🤝 Contributing

Contributions, suggestions, and feedback are welcome!

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Test your implementation.
5. Open a pull request describing your changes.

Please avoid committing credentials, private user information, or unverified government-benefit claims.

---

## 💚 Our Mission

We believe technology should make everyday life easier for everyone — especially the people whose hard work keeps our communities running.

KaamSaathi is a step toward making useful information, financial awareness, and workplace support more accessible to India's gig and informal workforce.

**Built with purpose. Powered by technology. Designed for people.**

---

<p align="center">
  <strong>KaamSaathi — Your Work. Your Rights. Your Companion.</strong>
</p>
