// Google API Configuration
// You need to create a project in Google Cloud Console
// Enable Google Drive API and Google Sheets API
// Create an OAuth 2.0 Client ID (Web Application)
// Add your origin (e.g., http://localhost:8080 or https://yourname.github.io) to "Authorized JavaScript origins"
// Add your API Key from "Credentials" section

const CONFIG = {
    // Replace with your Client ID (e.g., "123456789-abc...apps.googleusercontent.com")
    CLIENT_ID: '643913572222-8i90nnjuo7mb2f5k6tmrnepght96lnul.apps.googleusercontent.com',

    // This value will be replaced by the GitHub Actions workflow at build time.
    // If running locally, you must temporarily set your API Key here.
    API_KEY: 'GOOGLE_API_KEY_PLACEHOLDER',

    // Authorization scopes required by the API; multiple scopes can be
    // included, separated by spaces.
    SCOPES: 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/spreadsheets',

    // The name of the spreadsheet to look for or create
    SPREADSHEET_NAME: 'Wine Cellar Manager'
};
