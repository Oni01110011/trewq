# VenLab - Laboratory Information Management System

Ein modernes **Laboratory Information Management System (LIMS)** mit Vue.js Progressive Web App (PWA) Frontend, Spring Boot Backend und PostgreSQL Datenbank.

## 🎯 Projektübersicht

VenLab ist eine Full-Stack-Anwendung zur Verwaltung von Laborproben, chemischen Analysen und Messwerten. Das System bietet vollständige CRUD-Operationen (Create, Read, Update, Delete) für alle Datentabellen und kann als Progressive Web App auf Desktop- und Mobilgeräten installiert werden.

### Projektteam
- **Baichinger**
- **Stoilovski, D.**
- **Sarna, S.**

**Schule:** TGM-HIT  
**Kurs:** INSY5 - Informationssysteme

## 🏗️ Architektur

Das Projekt besteht aus drei Hauptkomponenten:

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Vue.js PWA    │────▶│  Spring Boot     │────▶│   PostgreSQL    │
│   Frontend      │     │  ReST Backend    │     │   Database      │
│  (Port 3000)    │     │  (Port 8080)     │     │  (Port 5432)    │
└─────────────────┘     └──────────────────┘     └─────────────────┘
        ▲                        │
        │                        │
        │                ┌───────▼────────┐
        │                │   Swagger UI   │
        │                │  (Port 8080)   │
        │                └────────────────┘
        │
        │                ┌────────────────┐
        └────────────────│    Adminer     │
                         │  (Port 8081)   │
                         └────────────────┘
```

### Technologie-Stack

#### Frontend
- **Vue.js 3** - Progressive JavaScript Framework mit Composition API
- **Vuetify 3** - Material Design Komponenten-Framework
- **Axios** - HTTP Client für API-Kommunikation
- **PWA Plugin** - Service Worker & Offline-Funktionalität
- **Nginx** - Webserver für Production Deployment

#### Backend
- **Spring Boot** - Java Backend Framework (als Git Submodule)
- **Spring Data JPA** - Datenbankzugriff
- **PostgreSQL** - Relationale Datenbank
- **Swagger/OpenAPI** - API-Dokumentation

#### Infrastructure
- **Docker & Docker Compose** - Containerisierung und Orchestrierung
- **Git Submodules** - Backend-Integration

## 🚀 Schnellstart

### Voraussetzungen

- Docker & Docker Compose installiert
- Git installiert
- (Optional) Node.js 16+ für lokale Entwicklung

### Installation & Start

```bash
# 1. Repository klonen
git clone https://github.com/TGM-HIT/insy5-informationssysteme-vue-pwa-insy_pwa_baichinger_dstoilovski_ssarna.git
cd insy5-informationssysteme-vue-pwa-insy_pwa_baichinger_dstoilovski_ssarna

# 2. Backend Submodule initialisieren
git submodule init
git submodule update

# 3. Environment-Variablen konfigurieren
# Erstelle eine .env Datei im Root-Verzeichnis:
cat > .env << EOF
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=venlab
EOF

# 4. Alle Services starten
docker compose up -d --build

# 5. Logs ansehen (optional)
docker compose logs -f
```

### Zugriff auf die Anwendung

Nach erfolgreichem Start sind folgende Services verfügbar:

| Service | URL | Beschreibung |
|---------|-----|--------------|
| **Frontend** | http://localhost:3000 | Vue.js PWA Benutzeroberfläche |
| **Backend API** | http://localhost:8080/api | ReST API Endpoints |
| **Swagger UI** | http://localhost:8080/swagger-ui/index.html | API-Dokumentation |
| **Adminer** | http://localhost:8081 | Datenbank-Verwaltung |
| **PostgreSQL** | localhost:5432 | Datenbank (direkt) |

## 📱 Progressive Web App (PWA) Features

Das Frontend ist als vollwertige PWA konfiguriert:

### ✨ PWA-Funktionen

- **📲 Installierbar:** "Add to Home Screen" auf Desktop & Mobile
- **🔌 Offline-Fähig:** Service Worker cached Assets automatisch
- **⚡ Schnell:** Optimierte Ladezeiten durch Caching
- **🎨 Native Experience:** Läuft wie eine native App
- **🔔 Push-Ready:** Infrastruktur für Push-Notifications vorbereitet

### PWA Installation

**Desktop (Chrome/Edge):**
1. Öffne http://localhost:3000
2. Klicke auf das "⊕ Installieren" Symbol in der Adressleiste
3. Bestätige die Installation

**Mobile (iOS/Android):**
1. Öffne die Seite im Browser
2. Menü → "Zum Startbildschirm hinzufügen"
3. App erscheint auf dem Homescreen

### Service Worker Details

- **Caching-Strategie:** Workbox mit GenerateSW
- **Google Fonts:** Cached für 1 Jahr
- **Bilder:** Cached für 30 Tage
- **App-Assets:** Automatisch gecached
- **Offline-First:** App funktioniert ohne Internet

**Konfiguration:** `frontend/vue.config.js` → `pwa` Section

## 💾 Datenbankstruktur

Das System verwaltet folgende Entitäten:

### 📊 Tabellen

| Tabelle | Beschreibung | CRUD Operations |
|---------|--------------|-----------------|
| **Analysis** | Chemische Analysedaten | ✅ Create, Read, Update, Delete |
| **Sample** | Probenverwaltung | ✅ Create, Read, Update, Delete |
| **Box** | Container/Boxen | ✅ Create, Read, Update, Delete |
| **BoxPos** | Positions-Tracking | ✅ Read |
| **Log** | System-Logs | ✅ Create, Read, Update, Delete |
| **Threshold** | Schwellenwerte | ✅ Create, Read, Update, Delete |

## 🎨 Frontend Features

### Benutzeroberfläche

- **📱 Responsive Design:** Desktop, Tablet & Mobile optimiert
- **🌓 Dark Mode:** Light/Dark Theme-Umschaltung
- **🔍 Suchfunktion:** Echtzeit-Suche in allen Tabellen
- **📄 Pagination:** Automatische Seitennummerierung (10 Items/Seite)
- **🔼 Sortierung:** Klick auf Spaltenüberschriften zum Sortieren
- **🎨 Material Design:** Moderne, konsistente UI mit Vuetify

### CRUD Operationen

**Create (Neu erstellen):**
- "Add New" Button in jeder Tabelle
- Dialog-Formular ausfüllen
- "Save" → Automatische Aktualisierung

**Read (Anzeigen):**
- Alle Daten in paginierter Tabellenansicht
- Suchfeld für Filterung
- Gesamt-Anzahl der Einträge

**Update (Bearbeiten):**
- 📝 Stift-Icon klicken
- Felder im Dialog ändern
- "Save" → Automatische Aktualisierung

**Delete (Löschen):**
- 🗑️ Papierkorb-Icon klicken
- Bestätigung erforderlich
- Automatische Aktualisierung

## 🔧 Entwicklung

### Lokale Frontend-Entwicklung (ohne Docker)

```bash
cd frontend

# Dependencies installieren
npm install

# Development Server starten
npm run serve
# → http://localhost:8083

# Production Build erstellen
npm run build

# Linting
npm run lint
```

**Hinweis:** Für lokale Entwicklung Backend-URL in Services anpassen:
`http://localhost:8080/api/`

### Backend-Entwicklung

Das Backend liegt als Git Submodule in `backend/`:

```bash
# Submodule aktualisieren
git submodule update --remote

# Backend separat starten (mit Maven/Gradle)
cd backend
./mvnw spring-boot:run
```

### Docker Commands

```bash
# Alle Services starten
docker compose up -d --build

# Nur Frontend neu bauen
docker compose up -d --build frontend

# Services stoppen
docker compose down

# Services stoppen + Volumes löschen
docker compose down -v

# Logs anzeigen
docker compose logs -f [service-name]

# Service neu starten
docker compose restart [service-name]
```

## 📁 Projektstruktur

```
insy5-informationssysteme-vue-pwa-*/
├── frontend/                      # Vue.js PWA Frontend
│   ├── public/
│   │   ├── manifest.json         # PWA Manifest
│   │   ├── img/icons/            # PWA Icons (72px-512px)
│   │   └── index.html
│   ├── src/
│   │   ├── components/           # Vue Komponenten
│   │   │   ├── AnalysisTable.vue
│   │   │   ├── SampleTable.vue
│   │   │   ├── BoxTable.vue
│   │   │   ├── BoxpoTable.vue
│   │   │   ├── LogTable.vue
│   │   │   └── ThresholdTable.vue
│   │   ├── services/             # Axios API Services
│   │   │   ├── analysisService.js
│   │   │   ├── sampleService.js
│   │   │   ├── boxService.js
│   │   │   ├── logService.js
│   │   │   └── thresholdService.js
│   │   ├── plugins/
│   │   │   └── vuetify.js        # Vuetify Config
│   │   ├── App.vue               # Haupt-Komponente
│   │   ├── main.js               # Entry Point
│   │   └── registerServiceWorker.js
│   ├── Dockerfile                # Multi-Stage Build
│   ├── nginx.conf                # Nginx mit API Proxy
│   ├── vue.config.js             # Vue & PWA Config
│   ├── package.json
│   ├── FRONTEND_README.md        # Detaillierte Frontend-Doku
│   └── PWA_README.md             # PWA-spezifische Doku
├── backend/                      # Spring Boot Backend (Submodule)
├── promptverzeichnis/            # Projekt-Prompts
├── docker-compose.yml            # Orchestrierung aller Services
├── .gitignore
├── .gitmodules                   # Backend Submodule Config
└── README.md                     # Diese Datei
```

## 🧪 Testing

### Frontend testen

```bash
cd frontend

# Lokaler Dev-Server
npm run serve

# Production Build testen
npm run build
npx serve -s dist
```

### PWA Features testen

1. Production Build erstellen: `npm run build`
2. Chrome DevTools öffnen (F12)
3. **Application** Tab:
   - ✅ Manifest korrekt geladen
   - ✅ Service Worker registriert
   - ✅ Icons vorhanden
   - ✅ Cache Storage aktiv
4. Lighthouse Audit:
   - "Generate report"
   - PWA Score prüfen

### API testen

**Swagger UI:** http://localhost:8080/swagger-ui/index.html

**Curl Beispiele:**
```bash
# Alle Samples abrufen
curl http://localhost:8080/api/samples

# Sample erstellen
curl -X POST http://localhost:8080/api/samples \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Sample", "description": "..."}'

# Sample aktualisieren
curl -X PUT http://localhost:8080/api/samples/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Sample"}'

# Sample löschen
curl -X DELETE http://localhost:8080/api/samples/1
```

## 🔒 Sicherheit

- ✅ CORS korrekt konfiguriert (Backend)
- ✅ API-Proxy durch Nginx (vermeidet CORS-Probleme)
- ✅ Keine Credentials im Frontend-Code
- ✅ Production Build entfernt Dev-Tools
- ✅ Service Worker nur über HTTPS (localhost ausgenommen)

## 🐛 Troubleshooting

### Frontend lädt nicht

```bash
# Container-Status prüfen
docker compose ps

# Logs ansehen
docker compose logs frontend

# Frontend neu starten
docker compose restart frontend
```

### API-Calls schlagen fehl

```bash
# Backend läuft?
docker compose ps backend

# Backend-Logs
docker compose logs backend

# API direkt testen
curl http://localhost:8080/api/samples
```

### Datenbank-Probleme

```bash
# Adminer öffnen: http://localhost:8081
# Credentials aus .env Datei verwenden

# PostgreSQL Logs
docker compose logs postgres

# Datenbank neu aufsetzen
docker compose down -v
docker compose up -d
```

### Port-Konflikte

Wenn Ports bereits belegt sind, in `docker-compose.yml` anpassen:

```yaml
frontend:
  ports:
    - "3001:80"  # Port 3000 → 3001 ändern
```

### PWA installiert nicht

- HTTPS erforderlich (localhost funktioniert ohne)
- Chrome/Edge verwenden (beste Unterstützung)
- Manifest & Service Worker in DevTools prüfen
- Icons müssen in allen Größen vorhanden sein

## 📚 Dokumentation

### Zusätzliche Dokumente

- **Frontend-Details:** [`FRONTEND_README.md`](FRONTEND_README.md)
- **PWA-Setup:** [`frontend/PWA_README.md`](frontend/PWA_README.md)

### Externe Ressourcen

- [Vue.js Dokumentation](https://vuejs.org/)
- [Vuetify Dokumentation](https://vuetifyjs.com/)
- [Vuetify Data Tables](https://vuetifyjs.com/en/components/data-tables/basics/)
- [Vue CLI PWA Plugin](https://cli.vuejs.org/core-plugins/pwa.html)
- [Workbox Documentation](https://developers.google.com/web/tools/workbox)
- [PWA Best Practices](https://web.dev/pwa/)
- [Spring Boot Dokumentation](https://spring.io/projects/spring-boot)

## 🎓 Assignment Compliance

Dieses Projekt erfüllt alle Anforderungen der Aufgabenstellung:

### ✅ Frontend (Vue Datatable)
- [x] CRUD-Funktionalität für Analysis-Tabelle mit Vuetify DataTables
- [x] Funktionsfähiges Deployment via Docker Container mit Nginx
- [x] Axios Service Classes für alle Tabellen (Sample, Box, BoxPos, Log, Threshold)
- [x] Alle Datenbank-Tabellen über Vue.js lesbar
- [x] OpenAPI-Dokumentation für alle Backend-Endpoints

### ✅ PWA (Progressive Web App)
- [x] Service Worker für Offline-Funktionalität
- [x] Web App Manifest mit Icons
- [x] "Add to Home Screen" Funktionalität
- [x] Workbox Caching-Strategie konfiguriert
- [x] PWA-Icons in allen erforderlichen Größen (72px-512px)

### ✅ Infrastructure
- [x] docker-compose.yml mit Frontend, Backend & Datenbank
- [x] Multi-Stage Dockerfile für optimierte Builds
- [x] Nginx mit API-Proxy-Konfiguration
- [x] .gitignore korrekt konfiguriert
- [x] Backend als Git Submodule integriert

## 🚧 Zukünftige Erweiterungen

Mögliche Verbesserungen für zukünftige Versionen:

- [ ] **Authentifizierung:** User Login & Session Management
- [ ] **Autorisierung:** Rollenbasierte Zugriffskontrolle
- [ ] **Bulk Operations:** Mehrere Datensätze gleichzeitig löschen/bearbeiten
- [ ] **Export-Funktionen:** CSV/Excel Export
- [ ] **Erweiterte Filter:** Komplexe Such- und Filterfunktionen
- [ ] **Real-time Updates:** WebSocket-Integration für Live-Updates
- [ ] **File Upload:** Dateien zu Proben hochladen
- [ ] **Charts & Visualisierung:** Datenvisualisierung mit Charts
- [ ] **Push Notifications:** Desktop & Mobile Benachrichtigungen
- [ ] **Internationalisierung:** Mehrsprachigkeit (i18n)

## 📄 Lizenz

Dieses Projekt wurde im Rahmen des INSY5-Kurses an der TGM-HIT entwickelt.

## 👥 Kontakt & Support

**Projektteam:**
- Baichinger
- Stoilovski, D.
- Sarna, S.

**Schule:** TGM - Technologisches Gewerbemuseum Wien  
**Abteilung:** Höhere Abteilung für Informationstechnologie (HIT)  
**Kurs:** INSY5 - Informationssysteme

---

**Hinweis:** Stellen Sie sicher, dass alle Docker-Container laufen, bevor Sie die Anwendung verwenden. Bei Problemen konsultieren Sie die Troubleshooting-Sektion oder die detaillierten README-Dateien in den jeweiligen Verzeichnissen.

**Viel Erfolg mit VenLab! 🧪🔬📊**
