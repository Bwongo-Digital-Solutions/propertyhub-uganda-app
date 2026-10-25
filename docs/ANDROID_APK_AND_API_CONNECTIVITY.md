# PropertyHub Uganda: Android APK Signing and API Connectivity

This guide explains how to create a persistent Android signing key, configure GitHub Actions, build a signed APK, and connect the app to the PropertyHub API using an external HTTPS endpoint, Wi-Fi/LAN, or Bluetooth PAN.

- Mobile repository: [propertyhub-uganda-app](https://github.com/Bwongo-Digital-Solutions/propertyhub-uganda-app)
- API/backend repository: [propertyhub-uganda](https://github.com/Bwongo-Digital-Solutions/propertyhub-uganda)
- Build workflow: [build-apk.yml](../.github/workflows/build-apk.yml)

## 1. Select the API connection

Set `EXPO_PUBLIC_API_URL` to the base URL of the API. The PropertyHub API uses port **8788** by default and the base path is **`/api`**.

| Connection | Example `EXPO_PUBLIC_API_URL` | Requirements |
|---|---|---|
| Public/external API | `https://api.example.com/api` | Replace with your real public HTTPS host and valid TLS certificate. |
| Wi-Fi/LAN to Ubuntu | `http://192.168.100.4:8788/api` | Use Ubuntu's actual reachable Wi-Fi/LAN IP; phone and computer must be on a network that routes between them. |
| Bluetooth PAN to Ubuntu | `http://10.20.30.1:8788/api` | Use Ubuntu's actual Bluetooth PAN IP; PAN must be connected and the phone must be able to reach that IP. |
| Android emulator | `http://10.0.2.2:8788/api` | This commonly maps to the host computer from the Android emulator. It is not for a physical phone. |

All IP addresses and hostnames above are examples, not values to copy blindly.

**Do not use `localhost` or `127.0.0.1` in an APK on a physical phone** when the API runs on Ubuntu; those addresses refer to the phone itself.

## 2. Start and verify the API on Ubuntu

In the backend repository, follow its setup instructions. The current project setup is:

```sh
bash scripts/setup-database.sh
npm run dev:api
```

Check that the API listens on port 8788:

```sh
sudo ss -ltnp 'sport = :8788'
```

For phone access, the API must bind to a reachable interface, usually `0.0.0.0:8788`, rather than only `127.0.0.1:8788`. If a firewall is active, allow port 8788 only on the trusted local interface needed for testing. Do not expose this prototype API to the public internet with plain HTTP.

The app also requires `EXPO_PUBLIC_API_KEY` to match `API_ACCESS_KEY` in the backend repository's `.env`. **This key is embedded in the mobile app and can be extracted.** It is a temporary guard for trusted local testing, not secure production authentication. Do not use this prototype with real tenant or financial data over the public internet until authentication, organisation-scoped authorisation, TLS, rate limiting and audit logging are implemented.

## 3. Option A — External/public API

1. Deploy the API and database using your chosen hosting environment.
2. Configure a stable HTTPS hostname with a valid TLS certificate.
3. Confirm the API is reachable from the phone and its base path is `/api`.
4. Set `EXPO_PUBLIC_API_URL` to your actual URL, for example `https://api.example.com/api`.
5. Configure `EXPO_PUBLIC_API_KEY` as described in section 6, then build a fresh APK.

Do not use the sample hostname. For a public production service, first implement proper user authentication and permissions; a shared mobile-embedded API key is not sufficient.

## 4. Option B — Wi-Fi/LAN

1. Connect the phone and Ubuntu computer to the same Wi-Fi/LAN.
2. On Ubuntu, run `hostname -I` and choose the address assigned to the Wi-Fi/LAN interface (not a Docker bridge IP).
3. Verify the API is listening on port 8788 on a reachable interface.
4. Make sure the Wi-Fi network permits device-to-device traffic and the Ubuntu firewall allows the API port on this trusted network.
5. Set `EXPO_PUBLIC_API_URL=http://<UBUNTU-LAN-IP>:8788/api`, replacing the placeholder with the actual IP.
6. Test from the phone against a known API endpoint, then build a new APK.

A LAN address may change. If it changes, update the variable and rebuild.

## 5. Option C — Bluetooth PAN

**Pairing by itself is not enough.** The phone and Ubuntu computer must have an active Bluetooth Personal Area Network (PAN) with IP connectivity.

1. On Android, enable **Settings → Hotspot & tethering → Bluetooth tethering** (names vary by device).
2. Pair the phone and Ubuntu.
3. Create a NetworkManager PAN client profile on Ubuntu, replacing the sample Bluetooth address with your phone's actual paired address:

   ```sh
   nmcli connection add type bluetooth con-name "PropertyHub Bluetooth" bluetooth.type panu bluetooth.bdaddr "AA:BB:CC:DD:EE:FF" ipv4.method auto ipv6.method auto
   ```

4. Activate the profile:

   ```sh
   nmcli connection up "PropertyHub Bluetooth"
   ```

5. Find the IP assigned to that connection:

   ```sh
   nmcli -g IP4.ADDRESS connection show "PropertyHub Bluetooth"
   ```

   Remove the subnet suffix such as `/24` when using the address in the URL.

6. Verify that the API is listening on port 8788 on a reachable interface and that the Android phone can actually reach the Ubuntu Bluetooth IP. A successful NetworkManager connection does not, by itself, prove that HTTP requests can travel back to the API.
7. Set `EXPO_PUBLIC_API_URL=http://<UBUNTU-BLUETOOTH-IP>:8788/api` using the actual address, and build a new APK only after reachability is confirmed.

Bluetooth PAN behavior varies by Android model and version. If the phone cannot route to Ubuntu, do not guess an IP or assume ordinary pairing carries HTTP traffic.

## 6. Configure the app's API variables in GitHub

Open the repository's **Settings → Secrets and variables → Actions**:

- [Actions secrets](https://github.com/Bwongo-Digital-Solutions/propertyhub-uganda-app/settings/secrets/actions)
- [Actions variables](https://github.com/Bwongo-Digital-Solutions/propertyhub-uganda-app/settings/variables/actions)

Create these **repository variables**:

| Name | Value |
|---|---|
| `EXPO_PUBLIC_API_URL` | The chosen external, Wi-Fi/LAN, or Bluetooth PAN API base URL, including `/api`. |
| `EXPO_PUBLIC_API_KEY` | The same value as `API_ACCESS_KEY` in the backend `.env` for trusted local testing only. |

Enter only the value, not `EXPO_PUBLIC_API_URL=` or quotation marks. The API key is embedded in the app, so treat it as public and do not rely on it to protect production data.

## 7. Create a persistent Android release keystore

A signing key identifies the Android app for future updates. Keep a secure backup and use the same key for every update; a new key generally cannot update an installation signed with the old one.

On Ubuntu, ensure `keytool` is installed, then run:

```sh
keytool -genkeypair -v \
  -keystore propertyhub-release.keystore \
  -alias propertyhub-release \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

Choose strong passwords and store them securely. Create the Base64 value for GitHub Actions:

```sh
base64 -w 0 propertyhub-release.keystore > propertyhub-release.keystore.base64
```

Base64 is not encryption. Never commit the keystore, its Base64 representation, or passwords to Git or upload them as public artifacts.

## 8. Add the signing secrets

In [repository Actions secrets](https://github.com/Bwongo-Digital-Solutions/propertyhub-uganda-app/settings/secrets/actions), create these exact **repository secrets**:

| Secret | Value |
|---|---|
| `ANDROID_KEYSTORE_BASE64` | Entire one-line contents of `propertyhub-release.keystore.base64` |
| `ANDROID_KEYSTORE_PASSWORD` | Keystore password |
| `ANDROID_KEY_ALIAS` | `propertyhub-release` if you used the example alias |
| `ANDROID_KEY_PASSWORD` | Password for that key alias |

The workflow requires these four secrets and both API variables (`EXPO_PUBLIC_API_URL`, `EXPO_PUBLIC_API_KEY`). Keep the original keystore and passwords safe for future releases.

## 9. Build and download the APK

1. Set the API variables for the connection mode you want this APK to use.
2. Open the repository's **Actions** tab.
3. Select **Build Android APK** / the build workflow.
4. Choose **Run workflow** when available, then start the run.
5. Wait for a successful run. The workflow checks TypeScript, generates the Android project, builds the release APK and verifies its signature.
6. Open the completed run and download the uploaded artifact named similar to `propertyhub-uganda-android-release-signed-<run-number>`.

The workflow artifact retention is three days, so download the APK promptly. A published GitHub Release can also be used to trigger a build when that event is enabled in the workflow.

## 10. Switch connection modes and troubleshoot

The `EXPO_PUBLIC_*` values are bundled at build time. Changing a GitHub variable does **not** change an APK already built; update the variable and build a new APK.

- **Workflow reports missing configuration:** Check all four signing secrets and both API variables.
- **App cannot connect:** Confirm the correct host IP, port 8788, `/api` path, API process, bind address and firewall.
- **Wi-Fi works but Bluetooth fails:** Verify active PAN, the actual Bluetooth IP and routing in both directions.
- **Works on Ubuntu only:** Check that the URL does not use `localhost` or `127.0.0.1`.
- **APK won't update an installed version:** Keep the same Android package ID and signing key.
- **LAN address changes:** Update `EXPO_PUBLIC_API_URL` and rebuild, or use a stable HTTPS endpoint.

For a mobile app used across different networks, a stable HTTPS API is more practical than rebuilding for each local IP.