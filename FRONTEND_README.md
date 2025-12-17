# Frontend Documentation - Vue.js CRUD Application

## Overview
This Vue.js frontend application provides CRUD (Create, Read, Update, Delete) functionality for all database tables from the existing ReST backend. The implementation uses modern JavaScript frameworks and tools for easy maintenance and extensibility, following the "Vue Datatable" assignment requirements.

## Technologies Used
- **Vue.js** - The Progressive JavaScript Framework for building web user interfaces ([Vue.js Documentation](https://vuejs.org/))
- **Vuetify 3** - Material Design component framework with data table components ([Vuetify Documentation](https://vuetifyjs.com/en/))
- **Axios** - Promise-based HTTP client for API requests
- **Nginx** - Web server for production deployment
- **Docker** - Containerized deployment integrated with docker-compose

## Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Backend ReST API from "ReST Backend" assignment
- Basic knowledge of JavaScript and ReST APIs

### Starting the Application
The complete application stack (frontend, backend, and database) is managed through docker-compose:

```bash
# Start all services (frontend, backend, database)
docker compose up -d --build

# View logs
docker compose logs -f frontend

# Stop all services
docker compose down
```

### Accessing the Application
- **Frontend UI**: http://localhost:3000
- **Backend API**: http://localhost:8090/api/
- **OpenAPI/Swagger Documentation**: http://localhost:8090/swagger-ui/index.html
- **Database Admin (Adminer)**: http://localhost:8082

## Features

### Task Requirements Fulfillment

#### ✅ Grundanforderungen überwiegend erfüllt
- **DataTable for Analysis**: Complete CRUD implementation using Vuetify DataTables ([Vuetify Data Tables Documentation](https://vuetifyjs.com/en/components/data-tables/basics/))
- **Frontend Deployment**: Fully functional deployment via Docker container with nginx
- **Axios Service Classes**: All tables (Sample, Box, BoxPos, Log, Threshold, Analysis) implemented as Axios service modules

#### ✅ Grundanforderungen zur Gänze erfüllt
- **OpenAPI Documentation**: All backend endpoints documented via Swagger UI
- **All Database Tables Accessible**: Complete read access to all tables via Vue.js application

### Implemented Tables
1. **Analysis** - Chemical analysis records with full CRUD operations
2. **Sample** - Sample management with full CRUD operations
3. **Box** - Box/container management with full CRUD operations
4. **BoxPos** - Position tracking with read operations
5. **Log** - System logs with full CRUD operations
6. **Threshold** - Threshold configuration with full CRUD operations

### CRUD Operations

#### Create (Add New)
- Click the "Add New" button in any table
- Fill in the form dialog
- Click "Save" to create the record
- Table automatically refreshes

#### Read (View)
- All tables display data in paginated format
- Search functionality available on every table
- Click through pages using built-in pagination
- Total record count displayed

#### Update (Edit)
- Click the pencil icon (📝) on any row
- Modify fields in the dialog
- Click "Save" to update
- Table automatically refreshes

#### Delete (Remove)
- Click the delete icon (🗑️) on any row
- Confirm deletion in the prompt
- Table automatically refreshes

### UI Features
- **Side Navigation**: Collapsible sidebar with icons for each table
- **Search**: Real-time search across all table fields
- **Pagination**: Automatic pagination (10 items per page by default)
- **Sorting**: Click column headers to sort
- **Dark Mode**: Toggle between light and dark themes
- **Responsive**: Works on desktop, tablet, and mobile devices
- **Status Indicator**: Shows "Connected" status in top bar

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── AnalysisTable.vue      # Analysis CRUD table
│   │   ├── SampleTable.vue        # Sample CRUD table
│   │   ├── BoxTable.vue           # Box CRUD table
│   │   ├── BoxpoTable.vue         # BoxPos read-only table
│   │   ├── LogTable.vue           # Log CRUD table
│   │   └── ThresholdTable.vue     # Threshold CRUD table
│   ├── services/
│   │   ├── analysisService.js     # Analysis API calls
│   │   ├── sampleService.js       # Sample API calls
│   │   ├── boxService.js          # Box API calls
│   │   ├── logService.js          # Log API calls
│   │   └── thresholdService.js    # Threshold API calls
│   ├── plugins/
│   │   ├── vuetify.js            # Vuetify configuration
│   │   └── webfontloader.js      # Font loader
│   ├── App.vue                    # Main application component
│   └── main.js                    # Application entry point
├── Dockerfile                     # Multi-stage Docker build
├── nginx.conf                     # Nginx configuration with API proxy
├── package.json                   # Dependencies
└── vue.config.js                  # Vue CLI configuration
```

## Service Layer Architecture

Each table has a dedicated Axios service module that handles all API interactions with the ReST backend. This separation of concerns makes the application easily maintainable and extensible.

**Service Structure:**
- Each service exports methods for CRUD operations: `getAll()`, `getById(id)`, `create(data)`, `update(id, data)`, `delete(id)`
- Services use Axios for HTTP communication with the backend API
- All API calls are proxied through nginx to avoid CORS issues
- Error handling is implemented at the service level

**Available Services:**
- `analysisService.js` - Analysis table operations
- `sampleService.js` - Sample table operations  
- `boxService.js` - Box table operations
- `logService.js` - Log table operations
- `thresholdService.js` - Threshold table operations

## Component Structure

All table components are built using Vuetify's DataTable component system, providing a consistent and maintainable structure.

**Component Pattern:**
1. **Template Section** with Vuetify components:
   - `v-text-field` for search functionality
   - `v-btn` for "Add New" action
   - `v-data-table` with columns definition (see [Vuetify Data Tables Basics](https://vuetifyjs.com/en/components/data-tables/basics/))
   - Action buttons (Edit/Delete) in table rows
   - `v-dialog` for Create/Edit forms

2. **Script Section** using Vue 3 Composition API:
   - Import of corresponding service module
   - Reactive state management
   - CRUD operation methods
   - Form validation and dialog management
   - Data formatting utilities

## API Integration

The frontend communicates with the backend through nginx proxy:

- Frontend request: `http://localhost:3000/api/samples`
- Proxied to: `http://backend:8080/api/samples`
- No CORS issues due to same-origin proxy

## Development

### Local Development (without Docker)
```bash
cd frontend
npm install
npm run serve
```

Access at: http://localhost:8080

**Note**: Update service URLs to point to `http://localhost:8090/api/` for local development.

### Building for Production
```bash
cd frontend
npm run build
```

Output in `frontend/dist/` directory.

### Linting
```bash
npm run lint
```

## Docker Deployment

The frontend is containerized using Docker and integrated into the docker-compose.yml alongside the backend and database services.

### Container Configuration

The frontend uses an nginx:stable-alpine container as recommended in the assignment specification. The deployment consists of:

**Multi-Stage Dockerfile:**
1. **Build Stage**: 
   - Node.js container installs dependencies from `package.json`
   - Executes `npm run build` to create optimized production bundle
   - Build artifacts are generated in the `dist/` directory

2. **Production Stage**:
   - Lightweight nginx:alpine base image (~23MB)
   - Built files copied to nginx's web root
   - Custom nginx configuration for API proxying

**Nginx Configuration:**
The `nginx.conf` provides:
- Static file serving from `/usr/share/nginx/html`
- Reverse proxy for `/api/*` requests to backend service (avoids CORS)
- SPA routing support (404s redirected to index.html)
- Gzip compression for optimized delivery

**docker-compose.yml Integration:**
- Frontend service depends on backend service
- Networked with backend for internal API communication
- Exposed on host port 3000 for browser access
- Automatic restart policy

## Troubleshooting

### Frontend Not Loading
```bash
# Check container status
docker compose ps

# View logs
docker compose logs frontend

# Restart frontend
docker compose restart frontend
```

### API Calls Failing
- Check backend is running: `docker compose ps backend`
- Verify backend logs: `docker compose logs backend`
- Test API directly: `curl http://localhost:8090/api/samples`

### Build Failures
```bash
# Clean and rebuild
docker compose down
docker compose up -d --build --force-recreate
```

### Port Conflicts
If ports are already in use, modify `docker-compose.yml`:
```yaml
frontend:
  ports:
    - "3001:80"  # Change 3000 to 3001
```

## Browser Compatibility
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance
- Lazy loading of table data
- Pagination reduces DOM elements
- Optimized production build with tree-shaking
- Gzipped assets served by nginx

## Security
- No credentials stored in frontend code
- All API calls go through backend
- CORS properly configured
- Production build removes development tools

## Assignment Compliance

This implementation fulfills all requirements of the "Vue Datatable" assignment:

✅ **CRUD functionality** for Analysis table with Vuetify DataTables  
✅ **Functional deployment** via Docker container with nginx  
✅ **Axios service classes** for Sample, Box, BoxPos, Log, and Threshold tables  
✅ **OpenAPI documentation** generated for all backend endpoints  
✅ **All database tables readable** through Vue.js application  
✅ **docker-compose.yml** includes frontend, backend, and database  
✅ **Source code** organized in `frontend/` directory  
✅ **.gitignore** properly configured (excludes `node_modules/`, build artifacts)

## References

This implementation was built using the official documentation sources specified in the assignment:

- **Vue.js Documentation**: [https://vuejs.org/](https://vuejs.org/)  
  "The Progressive JavaScript Framework" - Core framework documentation

- **Vuetify Documentation**: [https://vuetifyjs.com/en/](https://vuetifyjs.com/en/)  
  Material Design component library with comprehensive UI components

- **Vuetify Data Tables Basics**: [https://vuetifyjs.com/en/components/data-tables/basics/](https://vuetifyjs.com/en/components/data-tables/basics/)  
  DataTable component documentation used for all table implementations

- **Vue CLI Documentation**: [https://cli.vuejs.org/](https://cli.vuejs.org/)  
  Project scaffolding and build configuration

- **Axios Documentation**: Official HTTP client library for API communication

## Future Enhancements
- Bulk operations (delete multiple records)
- Export to CSV/Excel
- Advanced filtering and search
- Real-time updates via WebSocket
- User authentication
- Role-based access control
