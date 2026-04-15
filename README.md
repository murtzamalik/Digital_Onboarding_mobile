# cebos-mobile

Expo (SDK 54) + React Native + TypeScript app for the CEBOS digital account-opening flow. Navigation uses **React Navigation** native stack; screen placeholders match the status-driven onboarding flow.

## Prerequisites

- Node.js 18+ (LTS recommended)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) via `npx` (no global install required)
- For iOS simulator: Xcode (macOS)
- For Android emulator: Android Studio / SDK

## Install

```bash
cd mobile
npm install
```

## Start

```bash
npm start
```

Then press `i` (iOS simulator), `a` (Android emulator), or scan the QR code with Expo Go.

Other scripts:

```bash
npm run ios
npm run android
npm run web
```

## API base URL

`src/api/client.ts` resolves the backend base URL in this order:

1. **`EXPO_PUBLIC_API_BASE_URL`** — create a `.env` in `mobile/` (do not commit secrets):

 ```bash
   EXPO_PUBLIC_API_BASE_URL=https://api.example.com
   ```

2. **`expo.extra.apiBaseUrl`** in `app.json` (default: `http://localhost:8080/api/v1/mobile`)

3. Fallback: `http://localhost:8080/api/v1/mobile`

Use `getApiBaseUrl()` or `apiUrl('/...')` when calling the API.

## Navigation (dev vs production)

- **Development:** All routes are registered on one stack starting at **Splash**. Each placeholder has **Next (dev flow)** to walk through screens in `src/navigation/devScreenOrder.ts`.
- **Production:** Route by backend status API (resume step, error terminals, session expiry, force-update). See `src/navigation/getResumeRouteForStatus.ts` and comments on `RootNavigator` and `devScreenOrder`.

## Project layout

- `App.tsx` — root with `NavigationContainer` and `SafeAreaProvider`
- `src/navigation/` — stack, types, dev screen order
- `src/screens/` — one file per flow screen (placeholders)
- `src/api/client.ts` — configurable API base URL
