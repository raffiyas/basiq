# BASIQ MVP

BASIQ is a fitness and wellness coaching mobile app built with Expo React Native, TypeScript, and Supabase. It provides personalized coaching based on user data with a strict-but-kind approach.

## Features

- **Authentication**: Email/password login with Supabase Auth
- **Onboarding**: 3-step profile setup (Profile, Training, Nutrition)
- **Daily Check-ins**: 5-step wizard tracking sleep, state, training, nutrition, and notes
- **Home Dashboard**: Real-time stats with focus actions based on user data
- **Coach Chat**: Deterministic AI coach with structured responses (no external AI APIs)
- **Progress Tracking**: Weekly stats and trends
- **Settings**: Coach tone customization and profile management

## Tech Stack

- **Framework**: Expo SDK 51 + React Native
- **Language**: TypeScript
- **Navigation**: expo-router (file-based routing)
- **Backend**: Supabase (Auth + PostgreSQL)
- **State**: React Context API
- **UI**: Custom component library with design tokens
- **Target**: iPhone 15 Pro (iOS-first)

## Prerequisites

- Node.js 18+ and npm
- Expo CLI
- A Supabase account
- iOS Simulator (Mac) or Expo Go app

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd basiq
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

#### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

#### Run the Database Schema

1. In your Supabase project, go to the SQL Editor
2. Copy the contents of `supabase/schema.sql`
3. Run the SQL to create tables and RLS policies

### 4. Configure Environment Variables

1. Copy the example env file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Supabase credentials:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 5. Start the Development Server

```bash
npm start
```

Then press:
- `i` for iOS Simulator (Mac only)
- `a` for Android Emulator
- Scan QR code with Expo Go app on your phone

## Project Structure

```
basiq/
├── app/                    # App screens (expo-router)
│   ├── (tabs)/            # Main tabs (Hoy, Check-in, Coach, Progreso)
│   ├── checkin/           # Check-in wizard (5 steps)
│   ├── onboarding/        # Onboarding flow (3 steps)
│   ├── login.tsx          # Login screen
│   ├── settings.tsx       # Settings screen
│   └── _layout.tsx        # Root layout with auth guards
├── components/
│   └── ui/                # Reusable UI components
├── contexts/              # React Context providers
│   ├── AuthContext.tsx
│   ├── CheckinContext.tsx
│   └── OnboardingContext.tsx
├── hooks/                 # Custom React hooks
│   ├── useProfile.ts
│   ├── useTodayCheckin.ts
│   └── useRecentCheckins.ts
├── lib/
│   ├── coach/             # Rules engine (no AI)
│   │   ├── rules.ts       # Flag computation
│   │   ├── focusActions.ts
│   │   └── coachReply.ts  # Structured responses
│   ├── supabase.ts        # Supabase client
│   └── types.ts           # TypeScript types
├── theme/
│   └── tokens.ts          # Design system tokens
└── supabase/
    └── schema.sql         # Database schema + RLS

```

## Database Schema

The app uses 3 main tables:

### profile
User profile with onboarding data, training preferences, nutrition settings, and coach tone.

### daily_checkins
Daily check-in data including sleep, energy, stress, training, nutrition, and notes. Unique constraint on (user_id, date).

### coach_messages
Persisted coach chat messages with role (user/assistant/system) and content.

All tables have Row Level Security (RLS) enabled, restricting access to authenticated users' own data.

## Design System

The app uses a strict design system defined in `theme/tokens.ts`:

- **Colors**: Primary (#0EA5A4), Success, Warning, Danger
- **Typography**: System font, 4 variants (H1, H2, Body, Caption)
- **Spacing**: Consistent 16px screen padding, 12px gap
- **Shadows**: Subtle iOS shadow, Android elevation

## Coach Rules Engine

BASIQ uses a deterministic rules engine (no external AI):

1. **Flags**: Computed from last 7 days of check-ins
   - `fatigue_high`: Sleep < 6h for 2+ days OR energy ≤ 4
   - `adherence_low`: < 4 check-ins OR trained days < expected
   - `protein_low`: Protein missed 3+ days

2. **Focus Actions**: 1-3 actionable items based on flags

3. **Coach Replies**: Structured responses with:
   - **Hechos**: Data summary
   - **Interpretación**: What it means
   - **Acción**: What to do
   - **Límite**: Boundary/truth (varies by tone)

## Spanish (LatAm) Copy

All UI text is in Spanish (Latin America) with a "tú" voice. The tone is strict-but-kind, no fluff, no excessive emojis. See the copy system in the original requirements for exact strings.

## Development Commands

```bash
# Type checking
npm run typecheck

# Start dev server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## Sprint 1 Scope

This MVP includes:
- ✅ Auth flow with email/password
- ✅ 3-step onboarding
- ✅ 5-step daily check-in
- ✅ Home dashboard with stats and focus
- ✅ Rules engine (deterministic, no AI)
- ✅ Coach chat with persistence
- ✅ Progress screen with weekly stats
- ✅ Settings (coach tone, logout)

**NOT included in Sprint 1:**
- Apple Health integration
- External AI APIs
- Chart visualizations
- Weight/sleep trend graphs

## Contributing

This is an MVP. Keep changes minimal and aligned with the BASIQ philosophy: simple, reliable, data-driven.

## License

Proprietary
