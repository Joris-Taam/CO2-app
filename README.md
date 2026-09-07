# CO2-app

CO2-app is a web application for registering business and commuting trips,
managing vehicles and reservations, and viewing CO2-related reports. The
application is split into a frontend and a backend:

- `apps/web` contains the Vite multi-page frontend. It serves the HTML pages,
  TypeScript components, CSS, and browser-side repositories/services.
- `apps/api` contains the Express API. It exposes the application routes,
  authenticates users, manages sessions, and reads/writes data in MySQL.
- `apps/shared` contains TypeScript types and enums shared by both apps.
- `database.sql` contains seed/reset data for the `boeren` database.
- `docs` contains the TypeDoc documentation configuration and source files.

## Requirements

Install the following before starting:

- Git
- Node.js 22 or newer
- npm (included with Node.js)
- MySQL 8 (or a compatible MySQL server)

The API needs a MySQL database with the application's tables. The checked-in
`database.sql` file is a data reset/seed script; it assumes that the `boeren`
database and its tables already exist. Obtain or create the database schema
from the project database administrator before running the seed script.

## Starting from a fresh clone

### 1. Clone the repository

```bash
git clone <repository-url>
cd CO2-app
```

### 2. Install dependencies

Run this once from the repository root:

```bash
npm install
```

Because this repository uses npm workspaces, this installs dependencies for
both `apps/api` and `apps/web`.

### 3. Configure the API

Create `apps/api/.env.local` (this file is ignored by Git) and fill in the
credentials for your local MySQL server:

```dotenv
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=boeren
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_CONNECTION_LIMIT=10
```

The frontend currently uses `http://localhost:3001` for most API repositories,
so keep the API on port `3001` for local development. The API source defaults
to port `8080` only when `PORT` is not set.

### 4. Prepare and seed the database

Create the `boeren` database and make sure its schema has been installed.
Then, if you want the sample users and lookup data, run the seed/reset script:

```bash
mysql -u your_mysql_user -p boeren < database.sql
```

The script clears existing data in several tables. Do not run it against a
database containing data you need to keep.

The script includes test accounts:

| Account | Password | Role |
| --- | --- | --- |
| `test.admin@boeren.nl` | `Test1234!` | Admin |
| `test.medewerker@boeren.nl` | `Test1234!` | Medewerker |

Use these accounts only for local development and testing.

### 5. Configure the frontend

For the local API, create `apps/web/.env.local`:

```dotenv
VITE_API_URL=http://localhost:3001/
```

Most frontend repositories already target port `3001` directly; this variable
is also used by the shared welcome/session service and reservations.

### 6. Start the API

Open a terminal in the repository root and run:

```bash
npm run dev
```

The API is available at `http://localhost:3001`. The development build watches
the API TypeScript files and rebuilds them as they change.

### 7. Start the frontend

Open a second terminal in the repository root and run:

```bash
npm run dev --workspace=apps/web
```

Open `http://localhost:3000` in a browser. Vite serves the pages from
`apps/web/wwwroot`.

Stop either development server with `Ctrl+C`.

## How a request flows through the app

1. The browser loads one of the HTML entry points in `apps/web/wwwroot`.
2. The page imports a component from `apps/web/src` and uses a repository or
   service to call the API.
3. The Express server in `apps/api/src/index.ts` initializes the user and
   authentication ORM connections before listening.
4. The request is routed to a controller/router, then to a service.
5. Services use either TypeORM repositories or the MySQL connection pool to
   access the database.
6. The API returns JSON; the frontend updates the page or displays the result.

The main API route groups are:

| Route | Purpose |
| --- | --- |
| `/auth` | Login and authentication |
| `/users` | User management |
| `/api` | Trips and trip-related operations |
| `/reservations` | Reservations |
| `/vehicles` | Vehicles |
| `/adminReports` | Administrative reports |
| `/roles`, `/departments` | Roles and departments |
| `/faq`, `/contact` | Public FAQ and contact features |
| `/favorite-trip` | Favorite trips |

## Useful commands

Run commands from the repository root unless stated otherwise.

```bash
# Build the API and frontend
npm run build --workspace=apps/api
npm run build --workspace=apps/web

# Run API tests
npm test --workspace=apps/api

# Run frontend tests
npm test --workspace=apps/web

# Run API linting
npm run eslint --workspace=apps/api

# Run frontend linting
npm run eslint --workspace=apps/web

# Generate TypeDoc documentation
npm run typedoc
```

The compiled applications are written to `dist/api` and `dist/web`. After
building the API, it can be started with:

```bash
npm run preview --workspace=apps/api
```