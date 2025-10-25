# For You Real Estate - Mobile App

React Native mobile application for For You Real Estate platform.

## 🚀 Tech Stack

- **React Native** (Expo)
- **TypeScript**
- **NativeWind** (Tailwind CSS for React Native)
- **Expo Router** (File-based routing)
- **Zustand** (State management)
- **React Query** (API calls & caching)
- **Axios** (HTTP client)
- **Zod** (Validation)
- **React Hook Form** (Forms)
- **Expo Secure Store** (Secure token storage)
- **Inter Font** (Typography)

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web
npm run web
```

## 🏗️ Project Structure

```
mobile/
├── app/                    # Expo Router screens
│   ├── (auth)/            # Auth flow (dark theme)
│   │   ├── intro.tsx
│   │   ├── login.tsx
│   │   ├── sign-up-*.tsx
│   │   └── _layout.tsx
│   ├── (client)/          # Client role screens
│   ├── (broker)/          # Broker role screens
│   ├── index.tsx          # Entry point
│   └── _layout.tsx        # Root layout
│
├── components/            # React components
│   ├── ui/               # Design system components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── ...
│   ├── auth/             # Auth-specific components
│   └── common/           # Shared components
│
├── constants/            # Design tokens
│   ├── Colors.ts
│   ├── Typography.ts
│   └── Spacing.ts
│
├── api/                  # API client & endpoints
│   ├── client.ts         # Axios setup
│   └── auth.ts           # Auth endpoints
│
├── store/                # Zustand stores
│   └── authStore.ts
│
├── types/                # TypeScript types
│   └── user.ts
│
├── hooks/                # Custom React hooks
├── utils/                # Utility functions
└── assets/               # Images, fonts, etc.
```

## 🎨 Design System

### Colors
- **Dark theme** (Auth screens): Dark backgrounds, white text
- **Light theme** (Main app): White backgrounds, dark text
- **Primary**: Blue (`#1E3A8A`)
- **Inter Font**: All weights (300-700)

### Components
All components use NativeWind (Tailwind) for styling:

```tsx
<Button className="bg-primary-900 py-4 px-6 rounded-button">
  <Text className="text-white text-button font-inter-semibold">
    Sign Up
  </Text>
</Button>
```

## 🔐 Authentication

- JWT tokens stored in Expo Secure Store
- Auto token refresh
- Role-based routing (CLIENT, BROKER, INVESTOR, ADMIN)

## 📱 Screens

### Auth Flow (Dark Theme)
- ✅ Intro/Welcome
- ✅ Login
- ✅ Sign Up (General, Investor, Agent)

### Client/Investor
- Home/Properties Feed
- Property Details
- Favorites
- Filters
- Profile

### Broker/Agent
- Dashboard
- My CRM
- Leads Management
- Collections
- Knowledge Base

## 🔧 Configuration

Backend API URL is configured in `api/client.ts`:
- Development: `http://localhost:3000/api`
- Production: Update before deployment

## 📝 TODO

- [ ] Complete UI components (Button, Input, etc.)
- [ ] Implement all auth screens
- [ ] Add form validation with Zod
- [ ] Implement Client/Investor screens
- [ ] Implement Broker/Agent screens
- [ ] Add push notifications
- [ ] Add image upload
- [ ] Add maps integration

## 👨‍💻 Development

```bash
# Clear cache
npx expo start -c

# Generate types
npx expo customize tsconfig.json

# Check for updates
npx expo-doctor
```

