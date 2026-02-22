# Wine Cellar Manager PWA

A serverless Progressive Web App (PWA) for managing your wine collection using Google Sheets as the database.

## Features

- **Inventory View**: Browse your wine collection with search and filtering.
- **Add Wine**: Scan barcodes (UPC) or wine labels (OCR) to quickly add new bottles.
- **Google Sheets Integration**: Directly reads and writes to your personal Google Sheet.
- **Offline Capability**: Works offline (read-only for existing data).
- **Mobile First**: Optimized for mobile usage.

## Setup Instructions

### 1. Google Cloud Configuration

1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a new project.
3.  Enable **Google Sheets API** and **Google Drive API**.
4.  Go to **APIs & Services > Credentials**.
5.  Create an **OAuth 2.0 Client ID** (Web application).
    *   Add your GitHub Pages URL (e.g., `https://yourusername.github.io`) to **Authorized JavaScript origins**.
    *   Add your GitHub Pages URL (e.g., `https://yourusername.github.io`) to **Authorized redirect URIs**.
    *   Copy the **Client ID**.
6.  Create an **API Key**.
    *   Copy the **API Key**.
    *   (Recommended) Restrict the API key to use only the Sheets and Drive APIs and restrict it to your GitHub Pages domain (Referrer).

### 2. GitHub Configuration

1.  **Fork** or **Clone** this repository.
2.  Update `config.js` with your **Client ID** (this is safe to be public).
3.  Go to your GitHub Repository **Settings > Secrets and variables > Actions**.
4.  Click **New repository secret**.
    *   Name: `GOOGLE_API_KEY`
    *   Value: Paste your **API Key** from Google Cloud Console.
    *   Click **Add secret**.
5.  Push your changes to the `main` branch. This will trigger the GitHub Action to build and deploy your site.

### 3. GitHub Pages Setup

1.  Wait for the "Deploy to GitHub Pages" action to complete (check the **Actions** tab).
2.  Go to **Settings > Pages**.
3.  Under **Build and deployment > Source**, select **Deploy from a branch**.
4.  Under **Branch**, select `gh-pages` and save.
5.  Your site will be live at the displayed URL!

## Usage

1.  Open the app on your mobile device.
2.  Tap "Sign in with Google".
3.  Grant permissions to access your Google Drive/Sheets.
4.  Select an existing spreadsheet or create a new one.
5.  Start scanning and managing your wine cellar!

## Development

To run locally:
1.  Serve the directory using a simple HTTP server (e.g., `python3 -m http.server`).
2.  You will need to temporarily put your API Key into `config.js` manually (do not commit it!).
3.  Ensure `http://localhost:8000` (or your local port) is added to the Google Cloud Console "Authorized JavaScript origins".
