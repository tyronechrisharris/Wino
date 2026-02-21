const { createApp } = Vue;

const HEADERS = [
    "Item Name", "Year", "Country of Origin", "Varietal", "Volume",
    "Current Price", "Original Price", "Quantity", "Bottles consumed",
    "Bottles remaining", "Total Price", "Wine Points", "Source of Wine Points Ranking",
    "Lindy tasty notes", "lindy delusional score", "Tyrone tasting notes",
    "Tyrone perceived score", "Robot sommelier"
];

const app = createApp({
    data() {
        return {
            user: null,
            accessToken: null,
            wines: [],
            loading: false,
            loadingMessage: '',
            view: 'dashboard', // dashboard, add, stats, detail
            tokenClient: null,
            spreadsheetId: null,
            error: null,
            searchQuery: '',
            selectedWine: null,
            scanner: null,
            // Setup State
            taster1: '',
            taster2: '',
            newTaster1: '',
            newTaster2: '',
            spreadsheetsList: [],
            setupStep: 'choice', // choice, create, list
            isUpgrading: false,
            formData: {
                name: '',
                year: '',
                country: '',
                varietal: '',
                volume: '',
                currentPrice: '',
                originalPrice: '',
                quantity: 0,
                bottlesConsumed: 0,
                bottlesRemaining: 0,
                totalPrice: '',
                points: '',
                pointsSource: '',
                lindyNotes: '',
                lindyScore: '',
                tyroneNotes: '',
                tyroneScore: '',
                robotNotes: ''
            }
        };
    },
    watch: {
        'formData.quantity'() {
            this.updateRemaining();
        },
        'formData.bottlesConsumed'() {
            this.updateRemaining();
        }
    },
    computed: {
        filteredWines() {
            if (!this.searchQuery) return this.wines;
            const lowerQuery = this.searchQuery.toLowerCase();
            return this.wines.filter(wine =>
                (wine.name && wine.name.toLowerCase().includes(lowerQuery)) ||
                (wine.varietal && wine.varietal.toLowerCase().includes(lowerQuery)) ||
                (wine.country && wine.country.toLowerCase().includes(lowerQuery)) ||
                (wine.year && wine.year.toString().includes(lowerQuery))
            );
        }
    },
    methods: {
        openDetail(wine) {
            this.selectedWine = wine;
            this.view = 'detail';
        },
        editWine(wine) {
            this.selectedWine = wine;
            this.formData = { ...wine };
            this.view = 'add';
        },
        resetAndAdd() {
            this.selectedWine = null;
            this.resetForm();
            this.view = 'add';
        },
        resetForm() {
            this.formData = {
                name: '',
                year: '',
                country: '',
                varietal: '',
                volume: '',
                currentPrice: '',
                originalPrice: '',
                quantity: 0,
                bottlesConsumed: 0,
                bottlesRemaining: 0,
                totalPrice: '',
                points: '',
                pointsSource: '',
                lindyNotes: '',
                lindyScore: '',
                tyroneNotes: '',
                tyroneScore: '',
                robotNotes: ''
            };
        },
        updateRemaining() {
            const q = parseInt(this.formData.quantity) || 0;
            const c = parseInt(this.formData.bottlesConsumed) || 0;
            this.formData.bottlesRemaining = q - c;
        },
        async submitWineForm() {
            // Calculate remaining just in case
            this.updateRemaining();

            if (this.selectedWine) {
                await this.updateWine();
            } else {
                await this.saveWine();
            }
        },
        async saveWine() {
            this.loading = true;
            this.loadingMessage = 'Saving wine...';
            try {
                const row = this.wineToRow(this.formData);

                await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/Sheet1!A:R:append?valueInputOption=USER_ENTERED`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        values: [row]
                    })
                });

                await this.fetchWines();
                this.view = 'dashboard';

            } catch (error) {
                console.error("Error saving wine:", error);
                this.error = "Failed to save wine.";
            } finally {
                this.loading = false;
            }
        },

        async updateWine() {
            this.loading = true;
            this.loadingMessage = 'Updating wine...';
            try {
                const row = this.wineToRow(this.formData);
                const rowIndex = this.selectedWine._rowIndex; // 1-based index

                // Range is A{rowIndex}:R{rowIndex}
                const range = `Sheet1!A${rowIndex}:R${rowIndex}`;

                await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/${range}?valueInputOption=USER_ENTERED`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        values: [row]
                    })
                });

                await this.fetchWines();
                this.view = 'dashboard';
                this.selectedWine = null;

            } catch (error) {
                console.error("Error updating wine:", error);
                this.error = "Failed to update wine.";
            } finally {
                this.loading = false;
            }
        },

        wineToRow(wine) {
            // Convert object back to array in HEADERS order
            return [
                wine.name,
                wine.year,
                wine.country,
                wine.varietal,
                wine.volume,
                wine.currentPrice,
                wine.originalPrice,
                wine.quantity,
                wine.bottlesConsumed,
                wine.bottlesRemaining,
                wine.totalPrice,
                wine.points,
                wine.pointsSource,
                wine.lindyNotes,
                wine.lindyScore,
                wine.tyroneNotes,
                wine.tyroneScore,
                wine.robotNotes
            ];
        },
        startScanner() {
            const config = { fps: 10, qrbox: { width: 250, height: 250 } };

            const container = document.getElementById('scanner-container');
            if (container) container.classList.remove('hidden');

            this.scanner = new Html5Qrcode("scanner-container");

            this.scanner.start({ facingMode: "environment" }, config, (decodedText, decodedResult) => {
                this.onScanSuccess(decodedText, decodedResult);
            })
            .catch(err => {
                console.error("Error starting scanner", err);
                this.error = "Camera access failed.";
            });
        },

        onScanSuccess(decodedText, decodedResult) {
            console.log(`Scan result: ${decodedText}`, decodedResult);
            this.stopScanner();
            this.fetchProductInfo(decodedText);
        },

        stopScanner() {
            if (this.scanner) {
                this.scanner.stop().then(() => {
                    this.scanner.clear();
                    const container = document.getElementById('scanner-container');
                    if (container) container.classList.add('hidden');
                    this.scanner = null;
                }).catch(err => {
                    console.error("Failed to stop scanner", err);
                });
            } else {
                 const container = document.getElementById('scanner-container');
                 if (container) container.classList.add('hidden');
            }
        },

        async fetchProductInfo(barcode) {
            this.loading = true;
            this.loadingMessage = 'Looking up wine...';

            try {
                const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
                const data = await response.json();

                if (data.status === 1) {
                    const product = data.product;

                    let name = product.product_name || '';
                    if (product.brands) {
                        name = `${product.brands} ${name}`;
                    }
                    this.formData.name = name;
                    this.formData.country = product.countries || '';
                    this.formData.volume = product.quantity || '';

                    alert(`Found: ${name}`);
                } else {
                    alert("Product not found in database.");
                }
            } catch (error) {
                console.error("Error fetching product:", error);
                this.error = "Could not look up product.";
            } finally {
                this.loading = false;
            }
        },

        cancelAdd() {
            this.stopScanner();
            this.view = 'dashboard';
            this.selectedWine = null;
        },

        initGIS() {
             this.tokenClient = google.accounts.oauth2.initTokenClient({
                client_id: CONFIG.CLIENT_ID,
                scope: CONFIG.SCOPES,
                callback: (response) => {
                    if (response.error !== undefined) {
                        this.error = response;
                        console.error("GIS Error:", response);
                        return;
                    }
                    this.accessToken = response.access_token;

                    // Store token
                    localStorage.setItem('google_access_token', this.accessToken);
                    // Standard expiry is 3600s
                    const expiresIn = response.expires_in || 3599;
                    const expiry = Date.now() + (expiresIn * 1000);
                    localStorage.setItem('google_token_expiry', expiry);

                    this.fetchUserInfo();
                },
            });

            // Check for existing token
            const storedToken = localStorage.getItem('google_access_token');
            const expiry = localStorage.getItem('google_token_expiry');

            if (storedToken && expiry && Date.now() < parseInt(expiry)) {
                this.accessToken = storedToken;
                this.fetchUserInfo();
            }
        },
        handleAuthClick() {
            if (this.tokenClient) {
                // Prompt for consent if we are signing in explicitly
                // or just request token.
                // For a new login, we might want to ensure prompt if previous login failed?
                // But generally requestAccessToken() is enough.
                this.tokenClient.requestAccessToken({prompt: ''});
            } else {
                console.error("Token client not initialized");
            }
        },
        handleSignout() {
            const token = this.accessToken;
            if (token) {
                google.accounts.oauth2.revoke(token, () => {
                    console.log('Token revoked');
                });
            }
            this.accessToken = null;
            this.user = null;
            this.wines = [];
            this.spreadsheetId = null;
            localStorage.removeItem('google_access_token');
            localStorage.removeItem('google_token_expiry');
            localStorage.removeItem('wine_spreadsheet_id');
        },
        async fetchUserInfo() {
             this.loading = true;
             this.loadingMessage = 'Loading profile...';
             try {
                 const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                     headers: {
                         'Authorization': `Bearer ${this.accessToken}`
                     }
                 });

                 if (!response.ok) {
                     if (response.status === 401) {
                         // Token expired or invalid
                         this.handleSignout();
                         return;
                     }
                     throw new Error('Failed to fetch user info');
                 }

                 this.user = await response.json();

                 // After getting user, check login state
                 this.checkLoginState();

             } catch (error) {
                 console.error(error);
                 this.error = "Failed to sign in: " + error.message;
                 this.handleSignout();
             } finally {
                 this.loading = false;
             }
        },
        async checkLoginState() {
            this.loading = true;
            this.loadingMessage = 'Locating your wine cellar...';

            // Check local storage first
            let id = localStorage.getItem('wine_spreadsheet_id');
            if (id) {
                this.spreadsheetId = id;
                await this.fetchSettings(); // Get taster names
                await this.fetchWines();
            } else {
                // No ID found, go to setup
                this.view = 'setup';
                this.setupStep = 'choice';
                this.loading = false;
            }
        },

        async fetchSettings() {
            try {
                // Try to read Settings!A1:B1
                const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/Settings!A1:B1`, {
                    headers: { 'Authorization': `Bearer ${this.accessToken}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.values && data.values[0]) {
                        this.taster1 = data.values[0][0] || 'Taster 1';
                        this.taster2 = data.values[0][1] || 'Taster 2';
                        return true;
                    }
                }

                // Settings sheet might not exist or be empty
                console.warn("Settings sheet not found or empty.");
                this.taster1 = 'Taster 1';
                this.taster2 = 'Taster 2';
                return false;

            } catch (e) {
                console.error("Error fetching settings:", e);
                return false;
            }
        },

        async fetchSpreadsheets() {
            this.loading = true;
            this.loadingMessage = 'Searching for spreadsheets...';
            try {
                const query = "mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false";
                const response = await fetch(`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&orderBy=modifiedTime desc`, {
                    headers: { 'Authorization': `Bearer ${this.accessToken}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    this.spreadsheetsList = data.files || [];
                    this.setupStep = 'list';
                } else {
                    this.error = "Failed to list spreadsheets.";
                }
            } catch (e) {
                console.error("Error listing spreadsheets:", e);
                this.error = "Failed to list spreadsheets.";
            } finally {
                this.loading = false;
            }
        },

        async selectSpreadsheet(sheet) {
            this.spreadsheetId = sheet.id;
            localStorage.setItem('wine_spreadsheet_id', this.spreadsheetId);

            const settingsFound = await this.fetchSettings(); // Returns true/false (promise)

            if (settingsFound) {
                await this.fetchWines();
                this.view = 'dashboard';
            } else {
                // Prompt to set up names for existing sheet
                this.isUpgrading = true;
                this.setupStep = 'create';
            }
        },

        async upgradeCellar() {
             this.loading = true;
             this.loadingMessage = 'Upgrading your wine cellar...';
             try {
                // 1. Add 'Settings' Sheet (might fail if exists but empty, so handle error)
                try {
                    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}:batchUpdate`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${this.accessToken}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            requests: [
                                { addSheet: { properties: { title: 'Settings' } } }
                            ]
                        })
                    });
                } catch (e) {
                    console.log("Settings sheet might already exist, continuing...");
                }

                // 2. Write Taster Names to Settings
                const taster1 = this.newTaster1 || 'Taster 1';
                const taster2 = this.newTaster2 || 'Taster 2';

                await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/Settings!A1:B1?valueInputOption=USER_ENTERED`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        values: [[taster1, taster2]]
                    })
                });

                // 3. Construct Headers with Names (Optional for upgrade, but good to sync)
                // We might overwrite existing data headers if we are not careful.
                // But the requirement says "Make the spreadsheet for the user".
                // If upgrading, we assume it's a compatible sheet or the user wants to enforce this structure.
                // Let's be safe and ONLY update the headers if we are sure, or just skip it for upgrade
                // and rely on UI.
                // But `fetchSettings` relies on the sheet having the names.
                // Let's update the headers to match the new names.

                const customHeaders = [...HEADERS];
                customHeaders[13] = `${taster1} tasty notes`;
                customHeaders[14] = `${taster1} score`;
                customHeaders[15] = `${taster2} tasting notes`;
                customHeaders[16] = `${taster2} score`;

                await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/Sheet1!A1:R1?valueInputOption=USER_ENTERED`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        values: [customHeaders]
                    })
                });

                // Finalize
                this.taster1 = taster1;
                this.taster2 = taster2;
                await this.fetchWines();
                this.view = 'dashboard';
                this.loading = false;
                this.isUpgrading = false;

             } catch (error) {
                console.error("Error upgrading spreadsheet:", error);
                this.error = "Could not upgrade spreadsheet. " + error.message;
                this.loading = false;
             }
        },

        async createCellar() {
            this.loading = true;
            this.loadingMessage = 'Creating your wine cellar...';
            try {
                // 1. Create Spreadsheet
                const createResponse = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        properties: { title: CONFIG.SPREADSHEET_NAME }
                    })
                });

                if (!createResponse.ok) throw new Error('Sheets Create API error');

                const data = await createResponse.json();
                this.spreadsheetId = data.spreadsheetId;
                localStorage.setItem('wine_spreadsheet_id', this.spreadsheetId);

                // 2. Add 'Settings' Sheet
                await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}:batchUpdate`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        requests: [
                            { addSheet: { properties: { title: 'Settings' } } }
                        ]
                    })
                });

                // 3. Write Taster Names to Settings
                const taster1 = this.newTaster1 || 'Taster 1';
                const taster2 = this.newTaster2 || 'Taster 2';

                await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/Settings!A1:B1?valueInputOption=USER_ENTERED`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        values: [[taster1, taster2]]
                    })
                });

                // 4. Construct Headers with Names
                const customHeaders = [...HEADERS];
                // Update specific columns (0-indexed 13, 14, 15, 16)
                // "Lindy tasty notes", "lindy delusional score", "Tyrone tasting notes", "Tyrone perceived score"
                customHeaders[13] = `${taster1} tasty notes`;
                customHeaders[14] = `${taster1} score`;
                customHeaders[15] = `${taster2} tasting notes`;
                customHeaders[16] = `${taster2} score`;

                // 5. Write Headers to Sheet1
                await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/Sheet1!A1:R1?valueInputOption=USER_ENTERED`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        values: [customHeaders]
                    })
                });

                // Finalize
                this.taster1 = taster1;
                this.taster2 = taster2;
                this.wines = [];
                this.view = 'dashboard';
                this.loading = false;

            } catch (error) {
                console.error("Error creating spreadsheet:", error);
                this.error = "Could not create spreadsheet. " + error.message;
                this.loading = false;
            }
        },

        async fetchWines() {
            this.loading = true;
            this.loadingMessage = 'Fetching wines...';
            try {
                const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/Sheet1!A2:R?majorDimension=ROWS`, {
                    headers: { 'Authorization': `Bearer ${this.accessToken}` }
                });

                if (!response.ok) throw new Error('Sheets Fetch API error');

                const data = await response.json();

                if (data.values) {
                    this.wines = data.values.map((row, index) => this.parseWineRow(row, index));
                } else {
                    this.wines = [];
                }
            } catch (error) {
                console.error("Error fetching wines:", error);
                this.error = "Could not fetch data from spreadsheet.";
            } finally {
                this.loading = false;
            }
        },

        parseWineRow(row, index) {
            // Map row array to object based on HEADERS order
            // Ensure row has enough columns (fill with empty strings)
            const safeRow = [...row];
            while(safeRow.length < HEADERS.length) safeRow.push('');

            return {
                _rowIndex: index + 2, // 1-based index for API updates (A2 starts at index 0)
                name: safeRow[0],
                year: safeRow[1],
                country: safeRow[2],
                varietal: safeRow[3],
                volume: safeRow[4],
                currentPrice: safeRow[5],
                originalPrice: safeRow[6],
                quantity: safeRow[7],
                bottlesConsumed: safeRow[8],
                bottlesRemaining: safeRow[9],
                totalPrice: safeRow[10],
                points: safeRow[11],
                pointsSource: safeRow[12],
                lindyNotes: safeRow[13],
                lindyScore: safeRow[14],
                tyroneNotes: safeRow[15],
                tyroneScore: safeRow[16],
                robotNotes: safeRow[17]
            };
        }
    },
    mounted() {
        // Wait for GIS to load
        const checkGoogle = setInterval(() => {
            if (typeof google !== 'undefined' && google.accounts) {
                clearInterval(checkGoogle);
                this.initGIS();
            }
        }, 100);
    }
});

app.mount('#app');
