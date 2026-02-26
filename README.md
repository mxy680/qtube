# QTube

A full-stack YouTube-style video platform with AI-powered transcription, voice assistant support, and social features. Built with Next.js, Supabase, and OpenAI.

## Features

- 🎬 **Video hosting** — Browse, watch, and manage videos with channel organization
- 🤖 **AI transcription** — Automatic speech-to-text via OpenAI Whisper, with timestamped segments
- 🎙️ **Voice assistant** — Voice-powered search and interaction
- 📺 **YouTube integration** — Import YouTube channel avatars and video metadata via YouTube Data API
- 👤 **User profiles** — Supabase-authenticated accounts with customizable profiles
- ❤️ **Social features** — Likes and comments on videos
- 🗂️ **Categories** — Organize content by topic
- 🔐 **Auth** — Email/password + OAuth (Google, GitHub, etc.) via Supabase

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Auth & Storage | Supabase |
| ORM | Prisma 7 (PostgreSQL) |
| AI | OpenAI (Whisper API) |
| YouTube | YouTube Data API v3 |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Package Manager | pnpm |

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- A [Supabase](https://supabase.com) project
- A [Google Cloud](https://console.cloud.google.com) project with YouTube Data API v3 enabled
- An [OpenAI](https://platform.openai.com) API key

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/mxy680/qtube.git
cd qtube
```

2. **Install dependencies:**
```bash
pnpm install
```

3. **Set up environment variables:**

Create a `.env.local` file in the root:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# YouTube Data API v3
# https://console.cloud.google.com/apis/credentials
YOUTUBE_API_KEY=your-youtube-api-key

# OpenAI (Whisper for transcription)
# https://platform.openai.com/api-keys
OPENAI_API_KEY=your-openai-api-key

# Database (PostgreSQL via Supabase)
DATABASE_URL=your-database-url
```

4. **Set up Supabase Auth:**
   - Dashboard → Authentication → Providers → enable Email, Google, GitHub, etc.
   - Add redirect URLs:
     - `http://localhost:3000/auth/callback` (development)
     - `https://yourdomain.com/auth/callback` (production)

5. **Run database migrations:**
```bash
npx prisma migrate dev
npx prisma generate
```

6. **Start the dev server:**
```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000).

## Project Structure

```
qtube/
├── app/                    # Next.js App Router
│   ├── api/                # API route handlers
│   ├── auth/               # Auth pages (sign in, sign up, callback)
│   ├── watch/              # Video watch page
│   ├── layout.tsx
│   └── page.tsx            # Home feed
├── components/             # Reusable React components
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities and service clients
│   ├── supabase/           # Supabase client config
│   ├── auth.ts             # Server-side auth helpers
│   └── auth-client.ts      # Client-side auth hooks
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── migrations/         # Migration history
├── scripts/                # Utility scripts
├── types/                  # TypeScript type definitions
├── utils/                  # Shared utilities
└── proxy.ts                # Dev proxy config
```

## Database Schema

| Model | Description |
|-------|-------------|
| `Profile` | User profiles extending Supabase Auth |
| `Channel` | Video channels (user-created or YouTube-imported) |
| `Video` | Videos with transcripts, segments, and metadata |
| `Category` | Content categories |
| `Like` | User likes on videos |
| `Comment` | Comments on videos |

## Auth Routes

| Route | Description |
|-------|-------------|
| `/auth/signin` | Sign in page |
| `/auth/signup` | Sign up page |
| `/auth/callback` | OAuth callback handler |

## Scripts

```bash
pnpm dev              # Start development server
pnpm build            # Build for production (runs prisma generate first)
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm delete-all-videos  # Utility: delete all video records
```

## Deployment

Deploy on [Vercel](https://vercel.com):

1. Connect your GitHub repo to Vercel
2. Add all environment variables from `.env.local`
3. Set build command to `pnpm build`
4. Deploy

Make sure to add your production domain to Supabase's allowed redirect URLs.

## License

MIT
