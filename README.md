<p align="center">
  <img src="https://img.shields.io/badge/Free-Open%20Source-22c55e?style=for-the-badge" alt="Free & Open Source" />
  <img src="https://img.shields.io/badge/iOS-Available-007AFF?style=for-the-badge&logo=apple&logoColor=white" alt="iOS" />
  <img src="https://img.shields.io/badge/Android-Available-3DDC84?style=for-the-badge&logo=android&logoColor=white" alt="Android" />
</p>

<h1 align="center">Ascend</h1>

<p align="center">
  A free, open-source habit tracker that helps you build better routines.<br/>
  Track your habits, visualize your progress, and ascend to your best self.
</p>

<p align="center">
  <a href="#features">Features</a> &bull;
  <a href="#screenshots">Screenshots</a> &bull;
  <a href="#tech-stack">Tech Stack</a> &bull;
  <a href="#getting-started">Getting Started</a> &bull;
  <a href="#project-structure">Project Structure</a> &bull;
  <a href="#support">Support</a>
</p>

---

## Why Ascend?

Most habit trackers either lock features behind paywalls or drown you in complexity. Ascend gives you everything — unlimited habits, stats, calendar, custom colors, notifications — completely free. No subscriptions, no ads, no limits.

## Features

- **Unlimited Habits** — Create as many habits as you need with custom frequencies (daily, every 2 days, weekends, custom days)
- **Weekly Statistics** — Circle and graph views showing your completion rate and best habits
- **Calendar View** — See your habit history across months with color-coded completion dots
- **Custom Colors** — Full color wheel picker to personalize each habit and the app theme
- **Streak Tracking** — Current streak, best streak, and freeze protection for missed days
- **Smart Notifications** — Local push reminders scheduled per habit at your chosen time
- **Drag & Drop Reorder** — Organize your habits in any order you like
- **Multi-Language** — 9 languages: English, Spanish, French, German, Portuguese, Italian, Japanese, Korean, Chinese
- **Interactive Tutorial** — Guided onboarding for new users
- **Google Sign-In** — Quick authentication with your Google account

## Screenshots

<!-- TODO: Add screenshots here -->
<p align="center">
  <em>Screenshots coming soon</em>
</p>

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16, React 19 |
| Styling | Tailwind CSS v4 |
| Mobile | Capacitor 7 (iOS & Android) |
| Database | PostgreSQL (Prisma ORM) |
| Auth | NextAuth.js (Google OAuth) |
| 3D Background | Three.js, React Three Fiber |
| Animations | Framer Motion |
| Drag & Drop | dnd-kit |
| Hosting | Vercel |

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or [Prisma Postgres](https://www.prisma.io/postgres))
- Google OAuth credentials ([Google Cloud Console](https://console.cloud.google.com/))

### Setup

```bash
git clone https://github.com/Jergasus/Ascend.git && cd Ascend
npm install
cp .env.example .env
# Fill in your environment variables in .env
npx prisma migrate dev
npm run dev
```

Open **http://localhost:3000** to see the app.

### Mobile Development

Ascend uses Capacitor to run as a native app on iOS and Android:

```bash
# Build the web app
npm run build

# Sync with native platforms
npx cap sync ios      # or android

# Open in IDE
npx cap open ios      # Opens Xcode
npx cap open android  # Opens Android Studio
```

> [!NOTE]
> The app loads its frontend from a remote Vercel deployment by default. To develop locally, update the `server.url` in `capacitor.config.ts` to point to your local dev server IP.

## Project Structure

```
.
├── src/
│   ├── app/                        # Next.js pages & API routes
│   │   ├── api/
│   │   │   ├── auth/               # NextAuth + Google native auth
│   │   │   ├── completions/        # Habit completion toggle
│   │   │   ├── habits/             # Habits CRUD + reorder
│   │   │   └── theme/              # Theme color persistence
│   │   ├── auth/                   # Auth flow pages
│   │   ├── privacy/                # Privacy Policy
│   │   └── terms/                  # Terms of Service
│   │
│   ├── components/
│   │   ├── auth/                   # AuthButtons, AuthProvider
│   │   ├── habits/                 # Habit CRUD, list, form, sorting
│   │   ├── settings/               # Settings, color picker, language
│   │   ├── stats/                  # Statistics, calendar view
│   │   ├── ui/                     # Background, animations, nav, toast
│   │   ├── HomeWrapper.tsx         # Top-level wrapper
│   │   └── MainScreen.tsx          # Main app orchestrator
│   │
│   ├── contexts/                   # React contexts (Habits, Language, Toast)
│   ├── lib/                        # Server actions, DB, notifications, translations
│   └── types/                      # TypeScript types
│
├── prisma/                         # Database schema & migrations
├── android/                        # Capacitor Android project
├── ios/                            # Capacitor iOS project
├── public/                         # Static assets
├── capacitor.config.ts             # Capacitor configuration
└── .env.example                    # Environment variables template
```

## Configuration

All configuration is done via environment variables. See [`.env.example`](.env.example) for the full list.

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `GOOGLE_CLIENT_ID` | Google OAuth Web Client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret |
| `GOOGLE_IOS_CLIENT_ID` | Google OAuth iOS Client ID |
| `GOOGLE_ANDROID_CLIENT_ID` | Google OAuth Android Client ID |
| `NEXTAUTH_SECRET` | Session encryption key |
| `NEXTAUTH_URL` | App URL (e.g. `http://localhost:3000`) |
| `NEXT_PUBLIC_API_URL` | Deployed app URL |

## Support

Ascend is free and always will be. If you find it useful, you can support its development:

<p align="center">
  <a href="https://buymeacoffee.com/jergasus">
    <img src="https://img.shields.io/badge/Buy%20Me%20A%20Coffee-Support-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black" alt="Buy Me A Coffee" />
  </a>
</p>

## License

[MIT](LICENSE)
