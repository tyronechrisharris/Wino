const { createApp } = Vue;

const HEADERS = [
    "Item Name", "Year", "Country of Origin", "Varietal", "Volume",
    "Current Price", "Original Price", "Quantity", "Bottles consumed",
    "Bottles remaining", "Total Price", "Wine Points", "Source of Wine Points Ranking",
    "Lindy tasty notes", "lindy delusional score", "Tyrone tasting notes",
    "Tyrone perceived score", "Robot sommelier", "Barcode"
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
            ocrDebugLog: '',
            scanningLabel: false,
            scannedData: { name: null, year: null, country: null, varietal: null },
            ocrWorker: null,
            ocrStream: null,
            ocrInterval: null,
            isRecognizing: false,
            scanTarget: 'all', // all, name, year, country, varietal
            focusArea: null, // { x, y, width, height } (video coordinates)
            reticleStyle: { top: '50%', left: '50%', display: 'none' },
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
                robotNotes: '',
                barcode: ''
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
                robotNotes: '',
                barcode: ''
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
                wine.robotNotes,
                wine.barcode
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

            // Search local inventory first
            const match = this.wines.find(w => w.barcode === decodedText);

            if (match) {
                // Match Found: Populate form for editing
                this.selectedWine = match;
                this.formData = { ...match };
                this.showToast("Wine found! Loaded details.");
                this.view = 'add'; // Ensure we are in Add/Edit view
            } else {
                // No Match: New Wine Entry -> Switch to OCR
                this.resetForm();
                this.formData.barcode = decodedText;
                this.showToast("Unknown Barcode. Please scan the label.", 4000);

                // Switch to Label Scanner automatically
                setTimeout(() => {
                    this.startLabelScanner();
                }, 500);
            }
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

        cancelAdd() {
            this.stopScanner();
            this.stopLabelScanner();
            this.view = 'dashboard';
            this.selectedWine = null;
        },

        async startLabelScanner() {
            this.scanningLabel = true;
            this.scannedData = { name: null, year: null, country: null, varietal: null };
            this.ocrDebugLog = '';
            this.scanTarget = 'all';
            this.clearFocus();

            try {
                // Initialize Worker if needed
                if (!this.ocrWorker) {
                    this.loading = true;
                    this.loadingMessage = 'Initializing Scanner AI...';
                    this.ocrWorker = await Tesseract.createWorker('eng');
                    this.loading = false;
                }

                // Access Camera
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: "environment",
                        width: { ideal: 1920 },
                        height: { ideal: 1080 }
                    }
                });

                // Try to set focus mode if supported
                const track = stream.getVideoTracks()[0];
                const capabilities = track.getCapabilities ? track.getCapabilities() : {};
                if (capabilities.focusMode && capabilities.focusMode.includes('continuous')) {
                    try {
                        await track.applyConstraints({ advanced: [{ focusMode: 'continuous' }] });
                    } catch(e) {
                         console.log("Could not set focus mode", e);
                    }
                }

                this.ocrStream = stream;

                this.$nextTick(() => {
                    const video = document.getElementById('ocr-video');
                    if (video) {
                        video.srcObject = stream;
                        video.play();
                    }
                });

                // Start Loop (every 800ms)
                this.ocrInterval = setInterval(() => this.processVideoFrame(), 800);

            } catch (err) {
                console.error("Scanner Error:", err);
                this.showToast("Camera access failed or not supported.");
                this.scanningLabel = false;
                this.loading = false;
            }
        },

        async processVideoFrame() {
            if (!this.scanningLabel || this.isRecognizing) return;

            const video = document.getElementById('ocr-video');
            const canvas = document.getElementById('ocr-canvas');
            if (!video || !canvas) return;

            this.isRecognizing = true;

            const ctx = canvas.getContext('2d', { willReadFrequently: true });

            // Determine Draw Area (Full or Cropped)
            if (this.focusArea) {
                // UPSCALING for better OCR
                const scale = 2.0;

                // Set canvas size to scaled dimensions
                canvas.width = this.focusArea.width * scale;
                canvas.height = this.focusArea.height * scale;

                // Safety check for bounds
                let sx = Math.max(0, this.focusArea.x);
                let sy = Math.max(0, this.focusArea.y);

                // Ensure we don't read outside video
                // Note: sx/sy are in video source coordinates (unscaled)
                let sw = this.focusArea.width;
                let sh = this.focusArea.height;

                if (sx + sw > video.videoWidth) sx = video.videoWidth - sw;
                if (sy + sh > video.videoHeight) sy = video.videoHeight - sh;

                // Draw scaled up image
                ctx.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

                // BINARIZATION (Thresholding)
                // Get image data to manipulate pixels directly
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;

                // Calculate average brightness first (optional, but good for adaptive threshold)
                // Or just use fixed high contrast logic
                // Simple Otsu-like approximation:
                // Convert to grayscale and increase contrast
                for (let i = 0; i < data.length; i += 4) {
                    // Grayscale (luminance)
                    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];

                    // Thresholding
                    // If lighter than 100, make white. Else black.
                    // Wine labels often have dark backgrounds with light text OR light background with dark text.
                    // Tesseract prefers black text on white background.

                    // Attempt to normalize:
                    // If the image is mostly dark, we might need to invert?
                    // For now, let's just do standard binarization.

                    const threshold = 110;
                    const val = gray > threshold ? 255 : 0;

                    data[i] = val;     // R
                    data[i + 1] = val; // G
                    data[i + 2] = val; // B
                }
                ctx.putImageData(imageData, 0, 0);

            } else {
                // Full sweep - keep low res for performance
                // Downscale if video is 1080p to speed up sweep
                const scale = 0.5;
                canvas.width = video.videoWidth * scale;
                canvas.height = video.videoHeight * scale;

                // Simple filter
                ctx.filter = 'grayscale(1) contrast(1.2)';
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                ctx.filter = 'none';
            }

            // Extract text
            const dataUrl = canvas.toDataURL('image/jpeg');
            try {
                // Configure Tesseract for single block of text if focused
                // PSM 7 = Treat the image as a single text line.
                // PSM 6 = Assume a single uniform block of text.
                // We can't change worker params easily per frame without re-initializing,
                // so we rely on image processing.

                const { data: { text } } = await this.ocrWorker.recognize(dataUrl);
                const cleanedText = text.replace(/\n/g, ' ').trim();

                if (this.focusArea) {
                    // Focused Capture Mode: Direct Assignment
                    if (this.scanTarget !== 'all' && cleanedText.length > 2) {
                        this.assignFocusedText(cleanedText);
                    } else if (this.scanTarget === 'all') {
                         // Still run parser if "All" is selected even with focus
                         this.runSweepingParser(text);
                    }
                } else {
                    // Sweeping Mode
                    this.runSweepingParser(text);
                }

                // Debug Log
                this.ocrDebugLog = `Last Scan (${this.focusArea ? 'Focused' : 'Sweep'}):\nRAW: ${text.substring(0, 50)}...\nCLEAN: ${cleanedText.substring(0, 50)}...`;

                // Check Exit (only if sweeping or automated)
                if (!this.focusArea && this.scannedData.year && this.scannedData.country && this.scannedData.varietal) {
                    this.showToast("All data found!");
                    this.stopLabelScanner();
                }

            } catch (e) {
                console.error("Frame OCR Error", e);
            } finally {
                this.isRecognizing = false;
            }
        },

        assignFocusedText(text) {
             let clean = text.replace(/\s+/g, ' ').trim();
             // Extended regex for names/countries/varietals (allow accents)
             // \u00C0-\u00FF covers standard Latin-1 Supplement (Western European accents)
             clean = clean.replace(/[^a-zA-Z0-9\s\.\-\'\u00C0-\u00FF]/g, '');

             if (!clean || clean.length < 2) return;

             // Validation based on target
             if (this.scanTarget === 'year') {
                 // Strict year validation
                 // Must be between 1800 and Current Year + 2
                 const yearMatch = clean.match(/\b(18|19|20)\d{2}\b/);

                 if (yearMatch) {
                     const year = parseInt(yearMatch[0]);
                     const currentYear = new Date().getFullYear();
                     if (year > 1800 && year <= currentYear + 2) {
                        clean = yearMatch[0];
                     } else {
                         return; // Year out of range
                     }
                 } else {
                     return; // Not a valid year
                 }
             }

             // Map target to formData field
             const map = {
                 'name': 'name',
                 'year': 'year',
                 'country': 'country',
                 'varietal': 'varietal'
             };

             const field = map[this.scanTarget];
             if (field) {
                 // Only update if value changed to avoid spamming
                 const currentValue = this.formData[field];
                 if (currentValue !== clean) {
                    this.formData[field] = clean;

                    // Update overlay display too!
                    if (this.scannedData.hasOwnProperty(field)) {
                        this.scannedData[field] = clean;
                    }

                    // Feedback
                    if (navigator.vibrate) navigator.vibrate(50);
                    this.showToast(`Captured ${this.scanTarget}: ${clean}`, 1000);
                 }
             }
        },

        runSweepingParser(text) {
             const found = this.extractDataFromText(text);
             if (found.year && !this.scannedData.year) this.scannedData.year = found.year;
             if (found.country && !this.scannedData.country) this.scannedData.country = found.country;
             if (found.varietal && !this.scannedData.varietal) this.scannedData.varietal = found.varietal;
        },

        setScanTarget(target) {
            this.scanTarget = target;
            if (target === 'all') {
                this.clearFocus();
            } else {
                this.showToast(`Tap to capture ${target}`);
            }
        },

        handleVideoTap(event) {
            const video = event.target;
            const rect = video.getBoundingClientRect();

            // Click coordinates relative to video element
            const clickX = event.clientX - rect.left;
            const clickY = event.clientY - rect.top;

            // Calculate Video Scale
            // videoWidth is the intrinsic size (e.g., 1920x1080)
            // rect.width is the display size (e.g., 375x667)

            // Object-fit: cover logic is tricky.
            // If we assume the video fills the screen (100vw/100vh) and preserves aspect ratio:
            const videoRatio = video.videoWidth / video.videoHeight;
            const screenRatio = rect.width / rect.height;

            let scale, offsetX, offsetY;

            if (screenRatio > videoRatio) {
                // Screen is wider than video (video cropped top/bottom) - unlikely for mobile portrait
                scale = rect.width / video.videoWidth;
                offsetX = 0;
                offsetY = (rect.height - (video.videoHeight * scale)) / 2;
            } else {
                // Screen is taller than video (video cropped left/right) - standard mobile portrait
                scale = rect.height / video.videoHeight;
                offsetY = 0;
                offsetX = (rect.width - (video.videoWidth * scale)) / 2;
            }

            // Map Screen Click to Video Source Coordinate
            // sourceX = (clickX - offsetX) / scale
            const sourceX = (clickX - offsetX) / scale;
            const sourceY = (clickY - offsetY) / scale;

            // Define Crop Box (250x80 on screen -> scaled to source)
            // But user said "width: 250px; height: 80px" on screen.
            const screenW = 250;
            const screenH = 120;

            const sourceW = screenW / scale;
            const sourceH = screenH / scale;

            this.focusArea = {
                x: sourceX - (sourceW / 2),
                y: sourceY - (sourceH / 2),
                width: sourceW,
                height: sourceH
            };

            // Update Reticle UI (Position on screen)
            this.reticleStyle = {
                top: `${clickY}px`,
                left: `${clickX}px`,
                width: `${screenW}px`,
                height: `${screenH}px`,
                display: 'block'
            };

            // If target was 'all', switch to 'name' as default focused target?
            // Or just keep 'all' and focus?
            // "Capture Item Name... which is difficult".
            if (this.scanTarget === 'all') {
                this.setScanTarget('name');
            }
        },

        clearFocus() {
            this.focusArea = null;
            this.reticleStyle.display = 'none';
        },

        stopLabelScanner(manual = false) {
            if (this.ocrInterval) clearInterval(this.ocrInterval);
            if (this.ocrStream) {
                this.ocrStream.getTracks().forEach(track => track.stop());
            }
            this.scanningLabel = false;
            this.ocrStream = null;
            this.ocrInterval = null;

            // Populate Form
            if (this.scannedData.name) this.formData.name = this.scannedData.name;
            if (this.scannedData.year) this.formData.year = this.scannedData.year;
            if (this.scannedData.country) this.formData.country = this.scannedData.country;
            if (this.scannedData.varietal) this.formData.varietal = this.scannedData.varietal;

            if (manual) {
                this.showToast("Stopped scanning.");
            }
        },

        extractDataFromText(text) {
            const lowerText = text.toLowerCase();
            const result = {};

            // 1. Year
            const yearMatch = text.match(/\b(18|19|20)\d{2}\b/);
            if (yearMatch) {
                const y = parseInt(yearMatch[0]);
                const currentYear = new Date().getFullYear();
                if (y > 1800 && y <= currentYear + 2) {
                    result.year = y;
                }
            }

            // 2. Varietal
            for (const varietal of varietalKeywords) {
                if (lowerText.includes(varietal)) {
                    result.varietal = varietal.split(' ')
                        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(' ');
                    break;
                }
            }

            // 3. Country
            for (const [country, regions] of Object.entries(countryKeywords)) {
                if (lowerText.includes(country.toLowerCase()) || regions.some(r => lowerText.includes(r))) {
                    result.country = country;
                    break;
                }
            }

            // 4. Volume (Optional)
             const volMatch = text.match(/\b\d{3}\s?ml\b/i) || text.match(/\b1\.5\s?l\b/i) || text.match(/\b750\b/);
            if (volMatch) {
                result.volume = volMatch[0];
                this.formData.volume = result.volume; // Update form directly for volume as bonus
            }

            return result;
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
                    this.taster2 = settings.taster2 || '';
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
                        this.taster2 = data.values[0][1] || '';
                        return true;
                    }
                }

                // Settings sheet might not exist or be empty
                console.warn("Settings sheet not found or empty.");
                this.taster1 = 'Taster 1';
                this.taster2 = '';
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
                const taster2 = this.newTaster2 || '';

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
                customHeaders[15] = `${taster2 || 'Taster 2'} tasting notes`;
                customHeaders[16] = `${taster2 || 'Taster 2'} score`;

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
                 const taster2 = this.newTaster2 || '';

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
                const taster2 = this.newTaster2 || '';

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
                customHeaders[15] = `${taster2 || 'Taster 2'} tasting notes`;
                customHeaders[16] = `${taster2 || 'Taster 2'} score`;

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
                robotNotes: safeRow[17],
                barcode: safeRow[18]
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
