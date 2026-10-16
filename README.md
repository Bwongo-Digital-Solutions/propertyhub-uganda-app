# PropertyHub Uganda — Mobile Companion

React Native + Expo companion app for property owners, managers, caretakers, technicians, and tenants.

## Live database testing

The mobile app now reads and writes property, tenant/lease, and maintenance records through the API in the `Bwongo-Digital-Solutions/propertyhub-uganda` repository. It does not include sample property, tenant, or maintenance records.

1. Start PostgreSQL and the API using the web repository's local setup instructions (`docker compose up -d --build`).
2. Copy this app's environment template and set the values:
   ```bash
   cp .env.example .env
   ```
3. Set `EXPO_PUBLIC_API_URL=http://YOUR_UBUNTU_LAN_IP:8788/api`. Find the Ubuntu LAN address with `hostname -I`. Do not use `localhost` on a physical phone.
4. Set `EXPO_PUBLIC_API_KEY` to the same local test key as `API_ACCESS_KEY` in the web repository's `.env`.
5. Run:
   ```bash
   npm install
   npx expo start
   ```
6. Connect your phone and Ubuntu machine to the same trusted Wi-Fi/LAN. Ensure the host firewall allows TCP port 8788 from that device. Restart Expo after changing `.env`.

The app shows live dashboard figures, properties, tenant/lease records, and maintenance requests. Adding properties creates PostgreSQL records and units; registering a tenant creates an active lease for a vacant unit; maintenance creation and status changes are persisted. Empty database tables display empty states rather than sample records.

## IBM Carbon-inspired styling

This branch uses shared IBM Carbon-inspired palette, spacing, and radius tokens with native React Native components. The web-only `@carbon/react` library is not used in the Expo app.

## Security limitations

This is a trusted-network test setup with a shared API key and a single test organisation. It is not production authentication or complete role-based authorisation. Do not expose the API to the public internet or use real tenant/payment data until authenticated user access, organisation membership, audit logging, secure payment reconciliation, and production deployment controls are completed.
