const { createApp } = Vue;

const HEADERS = [
    "Item Name", "Year", "Country of Origin", "Varietal", "Volume",
    "Current Price", "Original Price", "Quantity", "Bottles consumed",
    "Bottles remaining", "Total Price", "Wine Points", "Source of Wine Points Ranking",
    "Lindy tasty notes", "lindy delusional score", "Tyrone tasting notes",
    "Tyrone perceived score", "Robot sommelier"
];

// ==========================================
// 1. COUNTRY & REGION KEYWORDS DICTIONARY
// ==========================================
const countryKeywords = {
    // FRANCE
    "France": [
        "france", "bordeaux", "burgundy", "bourgogne", "champagne", "rhone", "loire", "alsace",
        "languedoc", "roussillon", "provence", "beaujolais", "medoc", "saint-emilion", "pomerol",
        "margaux", "pauillac", "sauternes", "chablis", "cotes du rhone", "chateauneuf-du-pape",
        "sancerre", "pouilly-fume", "muscadet", "vouvrary", "chinon", "cahors", "bandol",
        "minervois", "corbieres", "jura", "savoie", "corsica", "corse", "vins de pays"
    ],

    // ITALY
    "Italy": [
        "italy", "italia", "tuscany", "toscana", "piedmont", "piemonte", "veneto", "sicily", "sicilia",
        "puglia", "apulia", "sardinia", "sardegna", "chianti", "brunello", "barolo", "barbaresco",
        "amarone", "valpolicella", "soave", "prosecco", "asti", "langhe", "nebbiolo", "sangiovese",
        "montepulciano", "abruzzo", "campania", "taurasi", "etna", "primitivo di manduria",
        "salice salentino", "brindisi", "umbro", "umbria", "friuli", "trentino", "alto adige",
        "lombardy", "lombardia", "franciacorta", "lambrusco", "emilia-romagna", "super tuscan"
    ],

    // UNITED STATES
    "USA": [
        "usa", "united states", "california", "napa", "sonoma", "paso robles", "central coast",
        "willamette", "oregon", "washington", "columbia valley", "walla walla", "finger lakes",
        "new york", "texas", "virginia", "santa barbara", "monterey", "mendocino", "russian river",
        "alexander valley", "stags leap", "rutherford", "oakville", "carneros", "anderson valley",
        "lodi", "santa cruz", "livermore", "temecula", "red mountain", "yakima", "dundee hills"
    ],

    // SPAIN
    "Spain": [
        "spain", "españa", "rioja", "ribera del duero", "priorat", "penedes", "cava", "rias baixas",
        "rueda", "toro", "la mancha", "valdepeñas", "jumilla", "yecla", "navarra", "bierzo",
        "somontano", "monsant", "jerez", "sherry", "andalucia", "galicia", "catalonia", "catalunya",
        "castilla", "aragon", "valencia"
    ],

    // GERMANY
    "Germany": [
        "germany", "deutschland", "mosel", "rheingau", "pfalz", "rheinhessen", "nahe", "baden",
        "franken", "ahr", "mittelrhein", "wurttemberg", "saale-unstrut", "saxony", "sachsen"
    ],

    // AUSTRIA
    "Austria": [
        "austria", "osterreich", "wachau", "kremstal", "kamptal", "traisental", "wagram", "weinviertel",
        "carnuntum", "thermenregion", "burgenland", "neusiedlersee", "leithaberg", "eisenberg",
        "mittelburgenland", "styria", "steiermark", "vulkanland", "sudsteiermark", "weststeiermark",
        "vienna", "wien"
    ],

    // PORTUGAL
    "Portugal": [
        "portugal", "douro", "porto", "port", "alentejo", "dao", "bairrada", "vinho verde", "minho",
        "setubal", "tejo", "lisboa", "madeira", "azores", "beira", "tras-os-montes", "algarve"
    ],

    // AUSTRALIA
    "Australia": [
        "australia", "barossa", "mclaren vale", "coonawarra", "clare valley", "hunter valley",
        "margaret river", "yarra valley", "mornington peninsula", "adelaide hills", "eden valley",
        "riverina", "tasmania", "victoria", "new south wales", "south australia", "western australia"
    ],

    // NEW ZEALAND
    "New Zealand": [
        "new zealand", "nz", "marlborough", "central otago", "hawke's bay", "hawkes bay", "martinborough",
        "wairarapa", "gisborne", "waipara", "nelson", "auckland", "waiheke", "canterbury"
    ],

    // CHILE
    "Chile": [
        "chile", "maipo", "colchagua", "cachapoal", "rapel", "curico", "maule", "casablanca",
        "leyda", "aconcagua", "limari", "elqui", "bio bio", "itata", "central valley"
    ],

    // ARGENTINA
    "Argentina": [
        "argentina", "mendoza", "uco valley", "lujan de cuyo", "maipu", "salta", "cafayate",
        "patagonia", "rio negro", "neuquen", "san juan", "la rioja"
    ],

    // SOUTH AFRICA
    "South Africa": [
        "south africa", "stellenbosch", "paarl", "franschhoek", "swartland", "constantia",
        "walker bay", "elgin", "robertson", "western cape", "coastal region", "breede river"
    ],

    // GEORGIA (The cradle of wine)
    "Georgia": [
        "georgia", "sakartvelo", "kakheti", "imereti", "kartli", "racha", "lechkhumi",
        "telavi", "tsinandali", "mukuzani", "kindzmarauli", "khvanchkara", "napareuli",
        "kvareli", "akhasheni", "qvevri"
    ],

    // ARMENIA
    "Armenia": [
        "armenia", "hayastan", "vayots dzor", "ararat", "armavir", "aragatsotn", "tavush"
    ],

    // HUNGARY
    "Hungary": [
        "hungary", "magyarorszag", "tokaj", "tokaji", "eger", "egri bikaver", "villany",
        "szekszard", "balaton", "somlo", "sopron", "pannonhalma", "kunsag", "matra"
    ],

    // MOLDOVA
    "Moldova": [
        "moldova", "republica moldova", "valul lui traian", "stefan voda", "codru",
        "cricova", "purcari", "milestii mici", "divin"
    ],

    // ROMANIA
    "Romania": [
        "romania", "dealu mare", "transylvania", "transilvania", "dobrogea", "cotnari",
        "murfatlar", "dragasani", "tarnave", "banat", "crisana", "muntenia", "oltenia"
    ],

    // BULGARIA
    "Bulgaria": [
        "bulgaria", "thracian valley", "trakiyska nizina", "danubian plain", "dunavska ravnina",
        "melnik", "struma valley", "black sea", "chernomorski rayon", "rose valley"
    ],

    // CROATIA
    "Croatia": [
        "croatia", "hrvatska", "istria", "istra", "dalmatia", "dalmacija", "slavonia",
        "slavonija", "peljesac", "dingac", "postup", "hvar", "korcula", "kvarner"
    ],

    // SLOVENIA
    "Slovenia": [
        "slovenia", "slovenija", "primorska", "podravje", "posavje", "goriska brda",
        "kras", "stajerska", "vipava", "istria"
    ],

    // GREECE
    "Greece": [
        "greece", "hellas", "santorini", "nemea", "naoussa", "macedonia", "peloponnese",
        "crete", "kiti", "pangeon", "amyntaio", "attica", "mantinia", "patras", "cephallonia"
    ],

    // SERBIA & NORTH MACEDONIA
    "Serbia": [
        "serbia", "srbija", "sumadija", "fruska gora", "zupa", "palic", "negotin"
    ],
    "North Macedonia": [
        "north macedonia", "macedonia", "tikves", "povardarie", "pelagonia"
    ],

    // LEBANON & TURKEY & ISRAEL
    "Lebanon": [
        "lebanon", "bekaa valley", "batroun", "mount lebanon", "jezouit"
    ],
    "Turkey": [
        "turkey", "turkiye", "thrace", "aegean", "marmara", "anatolia", "cappadocia", "izmir"
    ],
    "Israel": [
        "israel", "galilee", "golan heights", "judean hills", "negev", "shomron", "samaria"
    ],

    // OTHER NOTABLE REGIONS (Canada, Uruguay, Switzerland, etc.)
    "Canada": [
        "canada", "okanagan", "niagara", "british columbia", "ontario", "nova scotia"
    ],
    "Uruguay": [
        "uruguay", "canelones", "maldonado", "montevideo"
    ],
    "Switzerland": [
        "switzerland", "suisse", "valais", "vaud", "ticino", "geneva"
    ],
    "United Kingdom": [
        "uk", "united kingdom", "england", "sussex", "kent", "hampshire"
    ]
};


// ==========================================
// 2. VARIETAL KEYWORDS DICTIONARY
// ==========================================
const varietalKeywords = [
    // Standard & Popular Reds
    "cabernet sauvignon", "cabernet", "malbec", "merlot", "pinot noir",
    "zinfandel", "syrah", "shiraz", "petite sirah", "carmenere",
    "cabernet franc", "petit verdot", "grenache", "garnacha", "mourvedre",
    "monastrell", "cinsault", "carignan", "sangiovese", "nebbiolo", "barbera",
    "montepulciano", "nero d'avola", "aglianico", "primitivo", "tempranillo",
    "touriga nacional", "tinta roriz", "mencia", "pinotage", "gamay", "zweigelt",
    "blaufrankisch", "lemberger", "st. laurent", "dolcetto", "corvina",

    // Standard & Popular Whites
    "chardonnay", "sauvignon blanc", "pinot grigio", "pinot gris", "riesling",
    "chenin blanc", "viognier", "gewurztraminer", "gruner veltliner", "albarino",
    "alvarinho", "torrontes", "vermentino", "garganega", "cortese", "trebbiano",
    "macabeo", "viura", "verdejo", "semillon", "muscadet", "melon de bourgogne",
    "colombard", "marsanne", "roussanne", "picpoul", "muscat", "moscato", "pinot blanc",

    // Blends & Styles
    "red blend", "white blend", "bordeaux blend", "bordeaux", "gsm", "rhone blend",
    "chianti", "super tuscan", "rioja", "cava", "champagne", "prosecco", "port",
    "sherry", "madeira", "rose", "rosé", "blanc de blancs", "blanc de noirs",
    "meritage", "claret", "amarone", "valpolicella", "chablis", "sauternes",

    // Eastern European, Caucasus & Ancient Mediterranean
    "saperavi", "rkatsiteli", "mtsvane", "kisi", "tsitska", "krakhuna", "alexandrouli", // Georgia
    "areni", "voskehat", // Armenia
    "furmint", "harslevelu", "kekfrankos", "kadarka", "bikaver", // Hungary
    "feteasca neagra", "feteasca alba", "feteasca regala", "babeasca neagra", // Romania / Moldova
    "mavrud", "rubin", "broad leaved melnik", "pamid", // Bulgaria
    "plavac mali", "malvazija", "grasevina", "teran", "posip", // Croatia / Slovenia
    "vranec", "vranac", "prokupac", "tamjanika", // North Macedonia / Serbia
    "assyrtiko", "xinomavro", "agiorgitiko", "moschofilero", "malagousia", "roditis", // Greece
    "bogazkere", "okuzgozu", "narince", "emir", "kalecik karasi", // Turkey
    "tannat", // Uruguay (adopted) / France
    "vidal", "baco noir", "maréchal foch" // Hybrids / Canada
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
            isLocalMode: false,
            deferredPrompt: null,
            showInstallModal: false,
            isStandalone: false,
            toast: { show: false, message: '' },
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

            if (this.isLocalMode) {
                try {
                    const wine = { ...this.formData, id: Date.now() };
                    const wines = JSON.parse(localStorage.getItem('local_wines') || '[]');
                    wines.push(wine);
                    localStorage.setItem('local_wines', JSON.stringify(wines));
                    await this.fetchWines();
                    this.view = 'dashboard';
                } catch (e) {
                    console.error("Error saving local wine:", e);
                    this.error = "Failed to save wine locally.";
                }
                this.loading = false;
                return;
            }

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

            if (this.isLocalMode) {
                try {
                    const wines = JSON.parse(localStorage.getItem('local_wines') || '[]');
                    const index = wines.findIndex(w => (w.id === this.selectedWine.id) || (JSON.stringify(w) === JSON.stringify(this.selectedWine)));
                    // Fallback to index if no ID match (legacy local data)
                    const targetIndex = index !== -1 ? index : this.selectedWine._rowIndex;

                    if (targetIndex >= 0 && targetIndex < wines.length) {
                         wines[targetIndex] = { ...wines[targetIndex], ...this.formData };
                         localStorage.setItem('local_wines', JSON.stringify(wines));
                    }

                    await this.fetchWines();
                    this.view = 'dashboard';
                    this.selectedWine = null;
                } catch (e) {
                    console.error("Error updating local wine:", e);
                    this.error = "Failed to update wine locally.";
                }
                this.loading = false;
                return;
            }

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

                    // 1. Construct Name: "Brand + Product Name"
                    let name = product.product_name || '';
                    if (product.brands) {
                        name = `${product.brands} ${name}`;
                    }
                    this.formData.name = name.trim();

                    // 2. Map Country (Split if multiple, take first)
                    // Open Food Facts returns comma separated list often
                    let country = product.countries || product.origin || '';
                    if (country.includes(',')) {
                        country = country.split(',')[0].trim();
                    }
                    this.formData.country = country;

                    // 3. Map Volume
                    this.formData.volume = product.quantity || product.product_quantity || '';

                    this.showToast(`Found: ${this.formData.name}`);

                    // 4. Highlight Year Field & Prompt User
                    this.$nextTick(() => {
                        const yearInput = document.getElementById('wine-year-input');
                        if (yearInput) {
                            yearInput.focus();
                            yearInput.classList.add('ring-4', 'ring-yellow-400'); // Visual highlight
                            setTimeout(() => yearInput.classList.remove('ring-4', 'ring-yellow-400'), 3000);
                        }
                        this.showToast('Scan successful! Please enter the Vintage/Year.', 4000);
                    });

                } else {
                    this.showToast("Product not found in database.");
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

        async handleLabelImage(event) {
            const file = event.target.files[0];
            if (!file) return;

            this.loading = true;
            this.loadingMessage = 'Scanning label with AI...';

            try {
                const { data: { text } } = await Tesseract.recognize(
                    file,
                    'eng',
                    { logger: m => console.log(m) }
                );

                console.log("OCR Result:", text);
                this.parseOCR(text);

            } catch (err) {
                console.error("OCR Error:", err);
                this.showToast("Failed to scan label. Try again.");
            } finally {
                this.loading = false;
            }
        },

        parseOCR(text) {
            const lowerText = text.toLowerCase();

            // 1. Year (Vintage)
            const yearMatch = text.match(/\b(19|20)\d{2}\b/);
            if (yearMatch) {
                this.formData.year = parseInt(yearMatch[0]);
            }

            // 2. Varietal
            for (const varietal of varietalKeywords) {
                if (lowerText.includes(varietal)) {
                    // Title Case
                    this.formData.varietal = varietal.split(' ')
                        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(' ');
                    break;
                }
            }

            // 3. Country of Origin
            for (const [country, regions] of Object.entries(countryKeywords)) {
                if (lowerText.includes(country) || regions.some(r => lowerText.includes(r))) {
                    this.formData.country = country.charAt(0).toUpperCase() + country.slice(1);
                    break;
                }
            }

            // 4. Volume (Regex for common sizes)
            const volMatch = text.match(/\b\d{3}\s?ml\b/i) || text.match(/\b1\.5\s?l\b/i) || text.match(/\b750\b/);
            if (volMatch) {
                this.formData.volume = volMatch[0];
            }

            this.showToast("Label scanned! Please verify details.");
        },

        exportData() {
            const data = {
                settings: JSON.parse(localStorage.getItem('local_settings') || '{}'),
                wines: JSON.parse(localStorage.getItem('local_wines') || '[]')
            };

            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href",     dataStr);
            downloadAnchorNode.setAttribute("download", "wine_cellar_backup.json");
            document.body.appendChild(downloadAnchorNode); // required for firefox
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        },

        exportToCSV() {
            // 1. Prepare Headers (Dynamic Tasters)
            const taster1 = this.taster1 || 'Taster 1';
            const taster2 = this.taster2 || 'Taster 2';

            const customHeaders = [...HEADERS];
            customHeaders[13] = `${taster1} tasty notes`;
            customHeaders[14] = `${taster1} score`;
            customHeaders[15] = `${taster2} tasting notes`;
            customHeaders[16] = `${taster2} score`;

            // 2. Prepare Rows
            const rows = this.wines.map(wine => this.wineToRow(wine));

            // 3. Build CSV String
            // Helper to escape CSV fields
            const escapeCSV = (field) => {
                if (field === null || field === undefined) return '';
                const stringField = String(field);
                if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
                    return `"${stringField.replace(/"/g, '""')}"`;
                }
                return stringField;
            };

            let csvContent = "data:text/csv;charset=utf-8,";

            // Add Headers Row
            csvContent += customHeaders.map(escapeCSV).join(",") + "\r\n";

            // Add Data Rows
            rows.forEach(rowArray => {
                csvContent += rowArray.map(escapeCSV).join(",") + "\r\n";
            });

            // 4. Download
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "wine_cellar_export.csv");
            document.body.appendChild(link);
            link.click();
            link.remove();
        },

        importData(event) {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    if (data.settings && data.wines) {
                        localStorage.setItem('local_settings', JSON.stringify(data.settings));
                        localStorage.setItem('local_wines', JSON.stringify(data.wines));

                        this.showToast('Data imported successfully!');
                        await this.fetchSettings();
                        await this.fetchWines();
                        this.view = 'dashboard';
                    } else {
                        this.showToast('Invalid data format.');
                    }
                } catch (error) {
                    console.error("Import error:", error);
                    this.showToast('Failed to parse file.');
                }
            };
            reader.readAsText(file);
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
            if (this.isLocalMode) {
                this.isLocalMode = false;
                this.user = null;
                this.wines = [];
                this.view = 'dashboard';
                return;
            }

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
        startLocalMode() {
             this.isLocalMode = true;
             this.user = { picture: 'https://www.svgrepo.com/show/532362/user.svg' }; // Dummy user
             this.checkLoginState();
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
        installPWA() {
            if (this.deferredPrompt) {
                this.deferredPrompt.prompt();
                this.deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the install prompt');
                    } else {
                        console.log('User dismissed the install prompt');
                    }
                    this.deferredPrompt = null;
                });
            } else {
                this.showInstallModal = true;
            }
        },

        async checkLoginState() {
            this.loading = true;
            this.loadingMessage = 'Locating your wine cellar...';

            if (this.isLocalMode) {
                 const settings = await this.fetchSettings();
                 if (settings) {
                     await this.fetchWines();
                     this.view = 'dashboard';
                 } else {
                     this.view = 'setup';
                     this.setupStep = 'create'; // Skip choice in local mode
                 }
                 this.loading = false;
                 return;
            }

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
            if (this.isLocalMode) {
                const settings = JSON.parse(localStorage.getItem('local_settings') || 'null');
                if (settings) {
                    this.taster1 = settings.taster1;
                    this.taster2 = settings.taster2;
                    return true;
                }
                return false;
            }

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

        showToast(message, duration = 3000) {
            this.toast.message = message;
            this.toast.show = true;
            setTimeout(() => {
                this.toast.show = false;
            }, duration);
        },

        async createCellar() {
            this.loading = true;
            this.loadingMessage = 'Creating your wine cellar...';

            if (this.isLocalMode) {
                 const taster1 = this.newTaster1 || 'Taster 1';
                 const taster2 = this.newTaster2 || 'Taster 2';

                 const settings = { taster1, taster2 };
                 localStorage.setItem('local_settings', JSON.stringify(settings));

                 // Init empty wines if not present
                 if (!localStorage.getItem('local_wines')) {
                     localStorage.setItem('local_wines', JSON.stringify([]));
                 }

                 this.taster1 = taster1;
                 this.taster2 = taster2;
                 await this.fetchWines();
                 this.view = 'dashboard';
                 this.loading = false;
                 return;
            }

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

            if (this.isLocalMode) {
                try {
                    const localData = JSON.parse(localStorage.getItem('local_wines') || '[]');
                    this.wines = localData.map((wine, index) => ({...wine, _rowIndex: index}));
                    this.wines.forEach((w, i) => {
                         if(!w.id) w.id = Date.now() + Math.random();
                         w._rowIndex = i;
                    });
                } catch (e) {
                    this.wines = [];
                }
                this.loading = false;
                return;
            }

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
        // Check if standalone
        if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
            this.isStandalone = true;
        }

        // PWA Install Prompt Listener
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
        });

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
