# 🧑‍💻 Interview Management Dashboard

A full-featured **Interview Scheduling & Analytics Dashboard** built with **Next.js 14**.  
It simulates three roles — **Admin**, **TA Member**, and **Panelist** — and provides dashboards with analytics on interviews, attendance, candidate metrics, events, and more.

---

## 🚀 Features

- 🔐 **Authentication & Role Simulation** – Login as `admin`, `ta_member`, or `panelist` and see personalized dashboards.  
- 📊 **Key Metrics (KPIs)** – Track interviews scheduled, feedback scores, no-shows, offers, etc.  
- 📅 **Calendar & Events** – Manage interview schedules, panel discussions, and review meetings.  
- 📈 **Analytics & Charts** – Attendance, gender ratio, income vs expense, and interview trends.  
- 🔎 **Advanced Filters** – Filter by role, interviewer, and date range.  
- 🔁 **Session Management** – Secure login/logout simulation with cookie/session handling.  

---

## 🛠️ Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/interview-dashboard.git
cd interview-dashboard

npm install
# or
yarn
# or
pnpm install


npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev


| Role          | Username     | Password | Redirects To           |
| ------------- | ------------ | -------- | ---------------------- |
| **Admin**     | `admin`      | `1234`   | `/admin` Dashboard     |
| **TA Member** | `teamMember` | `1234`   | `/ta_member` Dashboard |
| **Panelist**  | `panel`      | `1234`   | `/panelist` Dashboard  |


const USERS = [
  { username: "admin",      password: "1234", role: "admin" },
  { username: "teamMember", password: "1234", role: "ta_member" },
  { username: "panel",      password: "1234", role: "panelist" },
];
