# PropertyHub Uganda — Mobile Companion

React Native + Expo companion for property owners, managers, caretakers, technicians, and tenants.

## IBM Carbon styling branch

The `carbon/mobile-mvp` branch uses Carbon-inspired design tokens with native React Native controls. Test this branch before merging it into `prototype/mobile-mvp`.

## Connect to the live PostgreSQL-backed API

The mobile app uses the shared API in `Bwongo-Digital-Solutions/propertyhub-uganda`. It does not contain seeded demo properties, tenants, or maintenance tasks. If the API is unreachable, it shows a connection error instead of silently substituting sample records.

1. Start PostgreSQL and the API using the web repository's `bash scripts/setup-database.sh`, then `npm run dev:api`.
2. Find your Ubuntu LAN IPv4 address with `hostname -I` (use the address on the same Wi-Fi/LAN as your phone).
3. Copy `.env.example` to `.env` in this repository.
4. Set `EXPO_PUBLIC_API_URL=http://<UBUNTU-LAN-IP>:8788/api`.
   - Android emulator often uses `http://10.0.2.2:8788/api`.
   - A physical phone must use the Ubuntu machine's LAN IP, not `localhost`.
5. Set `EXPO_PUBLIC_API_KEY` to the same value as `API_ACCESS_KEY` in the web repository's `.env`.
6. Ensure the phone and computer are on the same network and the Ubuntu firewall allows inbound TCP 8788 from that trusted LAN.
7. Run:

```bash
npm install
npx expo start
```

Changes made in the mobile app are sent to the API and persisted in PostgreSQL. Verify by refreshing the web app or by running `bash scripts/check-live-data.sh` in the web repository.

## Live-data screens

- **Home:** database-backed occupancy, confirmed rent collection, outstanding invoices, and open maintenance count.
- **Properties:** list and create properties/units.
- **Tasks:** list, create, and update maintenance requests.
- **Tenants:** list tenants and register a tenant against a vacant unit, creating an active lease.
- **More:** connection status and additional workspace entry points.

A fresh database is expected to be empty apart from its organisation record. No properties, tenants, payments, or invoices are preloaded.

## Important security note

The API key in `EXPO_PUBLIC_API_KEY` is embedded in the mobile client and is therefore visible to users who inspect the app bundle. It is only a temporary guard for trusted local testing. Do not expose this prototype or real tenant/financial data to the internet until proper user authentication, organisation-scoped permissions, rate limits, audit logs, TLS, and secure payment reconciliation are implemented. The API's manual payment ledger is not an MTN Mobile Money or Airtel Money integration.
