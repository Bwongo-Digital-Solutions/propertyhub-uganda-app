# PropertyHub Uganda — Mobile Companion

React Native + Expo companion prototype for property owners, managers, caretakers, technicians, and tenants.

## Included prototype screens

- **Home:** portfolio KPIs and quick actions.
- **Properties:** searchable property list and add-property form.
- **Tasks:** maintenance request list with local status transitions.
- **Tenants:** sample tenant directory and rent status.
- **More:** reports, settings, lease reminders, and security entry points.

All sample data is illustrative and held in app memory. This is not a production app and must not be used to store real tenant or payment information.

## Run locally

Requirements: Node.js 22+, npm 10+, Android Studio for Android emulator/device or Xcode on macOS for iOS.

```bash
npm install
npx expo start
```

Press `a` to open Android, `i` for iOS on macOS, or `w` for web preview.

## API integration

The companion is designed to use the shared API in `Bwongo-Digital-Solutions/propertyhub-uganda`. Before integration, configure an environment-specific API base URL and implement authenticated API clients. Do not hardcode payment provider secrets in the mobile app.

## Production requirements

Authentication, organisation-scoped authorisation, secure storage, API-backed persistence, push notifications, offline conflict handling, accessibility checks, and payment verification are not yet implemented.
