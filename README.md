# DentStore - Dental Supplies Demo

A full-stack e-commerce demo for dental supplies, built with **MedusaJS v2** and **Next.js 15**.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Docker Services                       │
│  ┌──────────────────┐    ┌──────────────────┐          │
│  │  PostgreSQL 15    │    │  Redis 7          │          │
│  │  Port: 5432       │    │  Port: 6379       │          │
│  └────────┬─────────┘    └────────┬─────────┘          │
└───────────┼───────────────────────┼─────────────────────┘
            │                       │
┌───────────▼───────────────────────▼─────────────────────┐
│              Medusa Backend - Port 9000                  │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  Store API    │  │  Admin API   │  │  Admin UI /app│  │
│  └──────────────┘  └──────────────┘  └───────────────┘  │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│          Next.js Storefront - Port 8000                  │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  Product      │  │  Cart &      │  │  Account      │  │
│  │  Catalog      │  │  Checkout    │  │  Management   │  │
│  └──────────────┘  └──────────────┘  └───────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Backend | MedusaJS | v2.13.1 |
| Storefront | Next.js (Turbopack) | v15.3.9 |
| Database | PostgreSQL | 15 |
| Cache | Redis | 7 |
| Package Manager | Yarn | 4.12.0 |
| Containerization | Docker Compose | v3.8 |

## Prerequisites

- **Node.js** v20+ (v25+ not supported by storefront)
- **Docker** & Docker Compose
- **Yarn** (included via Corepack)

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/cosmin-sisman/demo-medusajs-dentstore.git
cd demo-medusajs-dentstore
```

### 2. Start Docker services

```bash
docker-compose up -d
```

This starts PostgreSQL (port 5432) and Redis (port 6379).

### 3. Set up the Medusa backend

```bash
cd my-medusa-store

# Install dependencies
YARN_ENABLE_IMMUTABLE_INSTALLS=false yarn install

# Run database migrations
npx medusa db:migrate

# Seed demo data (store config, regions, shipping, products)
npx medusa exec src/scripts/seed.ts

# Seed dental-specific products & categories
npx medusa exec src/scripts/seed-dental.ts

# Create an admin user
npx medusa user -e admin@medusa-test.com -p supersecret

# Start the backend (includes admin dashboard)
npx medusa develop
```

Backend will be available at `http://localhost:9000`.

### 4. Set up the Next.js storefront

In a new terminal:

```bash
cd my-medusa-store-storefront

# Install dependencies
yarn install

# Start the storefront
yarn dev -p 8000
```

Storefront will be available at `http://localhost:8000`.

> **Note:** The `.env.local` file needs a valid `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`. After seeding, you can retrieve it from the admin dashboard (Settings > API Keys) or via the API.

## URLs

| Service | URL |
|---------|-----|
| Storefront | http://localhost:8000 |
| Backend API | http://localhost:9000 |
| Admin Dashboard | http://localhost:9000/app |
| Health Check | http://localhost:9000/health |

## Admin Credentials

| Field | Value |
|-------|-------|
| Email | `admin@medusa-test.com` |
| Password | `supersecret` |

## Demo Data

### Product Categories (Dental)

| Category | Description |
|----------|-------------|
| Instrumente Dentare | Hand and rotary instruments |
| Materiale Dentare | Composites, adhesives, cements |
| Echipamente | Equipment and devices |
| Igienizare si Sterilizare | Disinfection and sterilization |
| Consumabile | Gloves, masks, disposables |
| Ortodontie | Brackets, elastics, accessories |

### Sample Products (16 dental products)

- Kit Sonde Dentare Explorer (Set 5 buc)
- Oglinda Dentara cu Maner (Set 12 buc)
- Cleste Extractie Dentara Superior
- Freze Diamantate (Set 10 buc)
- Compozit Nanohybrid Universal 4g
- Adeziv Dentar Universal 5ml
- Ciment Ionomer de Sticla (GIC)
- Lampa Fotopolimerizare LED
- Scaler Ultrasonic Piezoelectric
- Solutie Dezinfectant Suprafete 1L
- Pungi Sterilizare Autoclav (200 buc)
- Manusi Nitril fara Pudra (100 buc)
- Masti Chirurgicale 3 Straturi (50 buc)
- Aspiratoare Saliva de Unica Folosinta (100 buc)
- Brackets Metalice Roth .022 (Set 20 buc)
- Elastice Ortodontice Latex-Free (1000 buc)

### Region & Currency

- **Region:** Europe (GB, DE, DK, SE, FR, ES, IT)
- **Currencies:** EUR (default), USD
- **Shipping:** Standard (2-3 days) and Express (24h)

## Project Structure

```
demo-medusajs-dentstore/
├── docker-compose.yml              # PostgreSQL + Redis
├── README.md
│
├── my-medusa-store/                # Medusa Backend + Admin
│   ├── src/
│   │   ├── admin/                  # Admin UI customizations
│   │   ├── api/                    # Custom API routes
│   │   ├── modules/                # Custom modules
│   │   ├── workflows/              # Custom workflows
│   │   ├── subscribers/            # Event listeners
│   │   ├── scripts/
│   │   │   ├── seed.ts             # Default seed data
│   │   │   └── seed-dental.ts      # Dental products seed
│   │   ├── jobs/                   # Scheduled jobs
│   │   └── links/                  # Module links
│   ├── medusa-config.ts            # Main configuration
│   └── package.json
│
└── my-medusa-store-storefront/     # Next.js Storefront
    ├── src/
    │   ├── app/                    # Next.js App Router pages
    │   ├── lib/                    # Utilities, hooks, data fetching
    │   ├── modules/                # UI components by feature
    │   └── styles/                 # Global CSS (Tailwind)
    ├── next.config.js
    └── package.json
```

## Useful Commands

```bash
# Stop all Docker services
docker-compose down

# Reset database (wipe all data)
docker-compose down -v
docker-compose up -d
cd my-medusa-store && npx medusa db:migrate

# Build backend for production
cd my-medusa-store && npx medusa build

# Build storefront for production
cd my-medusa-store-storefront && yarn build
```

## License

This is a demo project for educational purposes. MedusaJS is [MIT licensed](https://github.com/medusajs/medusa/blob/develop/LICENSE).
