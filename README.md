# PropertyHub Uganda — Mobile Companion

React Native + Expo companion for property owners, managers, caretakers, technicians, and tenants.

## Connect to the live PostgreSQL-backed API

The mobile app uses the shared API in [`Bwongo-Digital-Solutions/propertyhub-uganda`](https://github.com/Bwongo-Digital-Solutions/propertyhub-uganda). It does not contain seeded demo properties, tenants, or maintenance tasks. If the API is unreachable, it shows a connection error instead of silently substituting sample records.

1. Start PostgreSQL and the API using the web repository's `bash scripts/setup-database.sh`, then `npm run dev:api`.
2. Copy `.env.example` to `.env` in this repository.
3. Set `EXPO_PUBLIC_API_URL` to the API base URL. Choose the correct value for your connection:
   - Public API: `https://api.example.com/api` (replace with your real HTTPS host).
   - Wi-Fi/LAN to Ubuntu: `http://<UBUNTU-LAN-IP>:8788/api`.
   - Bluetooth PAN to Ubuntu: `http://<UBUNTU-BLUETOOTH-IP>:8788/api`.
   - Android emulator: commonly `http://10.0.2.2:8788/api`.
4. Set `EXPO_PUBLIC_API_KEY` to match `API_ACCESS_KEY` in the backend repository's `.env`. This is only a temporary guard for trusted local testing; it is embedded in the app and visible to users.
5. For Wi-Fi or Bluetooth, make sure the API listens on a reachable interface (not only `127.0.0.1`), port 8788 is accessible on the trusted local connection, and the phone can reach the selected IP.
6. Run:
   ```sh
   npm install
   npx expo start
   ```

See **[Android APK Signing and API Connectivity](docs/ANDROID_APK_AND_API_CONNECTIVITY.md)** for full instructions on signing release APKs, GitHub Actions configuration, external API deployment, Wi-Fi/LAN, Bluetooth PAN, and troubleshooting.

## IBM Carbon styling branch

The `carbon/mobile-mvp` branch uses Carbon-inspired design tokens with native React Native controls. Test this branch before merging it into `prototype/mobile-mvp`.

## Live-data screens

- **Home:** database-backed occupancy, confirmed rent collection, outstanding invoices, and open maintenance count.
- **Properties:** list and create properties/units.
- **Tasks:** list, create, and update maintenance requests.
- **Tenants:** list tenants and register a tenant against a vacant unit, creating an active lease.
- **More:** live rent invoices, payment ledger, pending-payment confirmation, connection status, and additional workspace entry points.

A fresh database is expected to be empty apart from its organisation record. No properties, tenants, payments, or invoices are preloaded.

## Important security note

The API key in `EXPO_PUBLIC_API_KEY` is embedded in the mobile client and is therefore visible to users who inspect the app bundle. It is only a temporary guard for trusted local testing. Do not expose this prototype or real tenant/financial data to the internet until proper user authentication, organisation-scoped permissions, rate limits, audit logs, TLS, and secure payment reconciliation are implemented. The API's manual payment ledger is not an MTN Mobile Money or Airtel Money integration.
