# Wine Cellar Manager PWA

A serverless, client-side Progressive Web App (PWA) to manage your wine cellar using Google Sheets as the database.

## Features

*   **Google Integration**: Sign in with your Google account.
*   **Zero Backend**: Uses your personal Google Sheet to store data.
*   **PWA**: Installable on iOS and Android. Works offline (cached app shell).
*   **Inventory Management**: Track bottles, prices, tasting notes, and scores.
*   **Barcode Scanner**: Scan UPCs to auto-fill wine details using Open Food Facts.
*   **Mobile First**: Designed for mobile use with a clean UI.

## Setup Instructions

### 1. Create a Google Cloud Project

1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a new project (e.g., "Wine Cellar Manager").
3.  **Enable APIs**:
    *   Go to **APIs & Services > Library**.
    *   Search for and enable **Google Sheets API**.
    *   Search for and enable **Google Drive API**.

### 2. Configure OAuth Consent Screen

1.  Go to **APIs & Services > OAuth consent screen**.
2.  Select **External** (unless you have a Google Workspace organization).
3.  Fill in the app name, support email, and developer contact info.
4.  **Scopes**: Add the following scopes:
    *   `https://www.googleapis.com/auth/drive.file`
    *   `https://www.googleapis.com/auth/spreadsheets`
5.  **Test Users**: Add your own Google email address as a test user.

### 3. Create Credentials

1.  Go to **APIs & Services > Credentials**.
2.  **Create API Key**:
    *   Click **Create Credentials > API Key**.
    *   Copy the key. You will need this for `config.js`.
    *   (Recommended) Restrict the key to "Google Sheets API" and "Google Drive API" and your domain.
3.  **Create OAuth Client ID**:
    *   Click **Create Credentials > OAuth client ID**.
    *   Application type: **Web application**.
    *   Name: "Wine Cellar App".
    *   **Authorized JavaScript origins**:
        *   Add `http://localhost:8080` (for local testing).
        *   Add your GitHub Pages URL (e.g., `https://<username>.github.io`).
    *   Click **Create**.
    *   Copy the **Client ID**.

### 4. Configure the App

1.  Open `config.js` in the project root.
2.  Replace `YOUR_CLIENT_ID_HERE` with your OAuth Client ID.
3.  Replace `YOUR_API_KEY_HERE` with your API Key.

### 5. Deployment

1.  Push the code to a GitHub repository.
2.  Go to **Settings > Pages**.
3.  Select the `main` branch as the source.
4.  Your app will be live at `https://<username>.github.io/<repo-name>/`.

## Usage

1.  Open the app.
2.  Click **Sign in with Google**.
3.  Grant permission to create files in your Drive.
4.  The app will search for a spreadsheet named **"Wine Cellar Manager"**.
    *   If it doesn't exist, it will create one with the correct columns.
    *   If you have an existing one, rename it to "Wine Cellar Manager" or update the name in `config.js`.

## Data Structure

The app expects the following columns in the spreadsheet (Row 1 headers):
*   Item Name, Year, Country of Origin, Varietal, Volume
*   Current Price, Original Price, Quantity, Bottles consumed, Bottles remaining, Total Price
*   Wine Points, Source of Wine Points Ranking
*   Lindy tasty notes, lindy delusional score
*   Tyrone tasting notes, Tyrone perceived score
*   Robot sommelier

## License

MIT
