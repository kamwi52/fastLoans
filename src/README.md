# Mulonga Group Loan Application - Backend Setup

This application supports dual-mode storage: **Local Storage** (for offline/fast dev) and **Google Sheets** (for centralized management).

## 1. Local Storage Mode (Default)
The app uses `localStorage` to persist data. To facilitate testing, a migration system seeds the database with test users and loans.

### Dev Utilities
- **Reset Data**: Open the browser console and run `resetApp()`. This clears storage and re-seeds initial data.
- **Migration**: Versioning is handled via `zf_migration_version` in storage. Updating the `CURRENT_VERSION` in `migration.ts` triggers a fresh seed for all users.

## 2. Google Sheets Integration
To connect the app to a Google Sheet, follow these steps:

### Google Apps Script Configuration
1. Create a Google Sheet with tabs: `Accounts`, `Loans`, and `Transactions`.
2. Navigate to **Extensions > Apps Script** and paste the proxy script (see `GOOGLE_SHEETS_SETUP.md` for full script source).
3. Deploy as a **Web App**:
   - **Execute as**: Me
   - **Who has access**: Anyone
4. Copy the provided Web App URL.

### Environment Setup
Create a `.env` file in the project root:

```env
VITE_STORAGE_MODE=cloud
VITE_GOOGLE_SCRIPT_URL=your_deployment_url_here
```

## 3. Configuration Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `VITE_STORAGE_MODE` | `local` or `cloud` | `local` |
| `VITE_API_TIMEOUT` | Request timeout in ms | `5000` |

## 4. Authentication & Permissions
- **Cloud Mode**: The Google Apps Script must be shared with the appropriate permissions. Since it's deployed as "Anyone," the URL should be treated as a secret.
- **Local Mode**: PIN-based authentication is handled against the `zf_accounts` object in `localStorage`.

## 5. Switching Modes
The application uses a factory pattern to determine which storage engine to use based on the `VITE_STORAGE_MODE` variable. Simply toggle this value and restart the dev server to switch between a local sandbox and the live Google Sheets backend.