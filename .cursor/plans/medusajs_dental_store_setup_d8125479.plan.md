---
name: MedusaJS Dental Store Setup
overview: "Setup complet MedusaJS v2.13 demo dental store: Docker pentru PostgreSQL + Redis, backend cu admin dashboard, storefront Next.js, si date demo pre-populate -- totul configurat \"ca la carte\"."
todos:
  - id: prereq-check
    content: "Verificare prerequisite: Node.js v20+, Docker, yarn, Git"
    status: completed
  - id: docker-compose
    content: Creare docker-compose.yml cu PostgreSQL 15 si Redis 7, pornire servicii
    status: completed
  - id: create-medusa-app
    content: Rulare create-medusa-app cu yarn, seed data, si Next.js storefront
    status: completed
  - id: verify-backend
    content: Verificare backend pe localhost:9000 si admin dashboard pe localhost:9000/app
    status: completed
  - id: verify-storefront
    content: Verificare storefront Next.js pe localhost:8000
    status: completed
  - id: dental-seed-data
    content: Populare cu date specifice dental store (categorii, produse, regiuni)
    status: completed
  - id: final-validation
    content: Build check, test flow complet, validare finala
    status: completed
isProject: false
---

# MedusaJS v2 Dental Store -- Setup Complet

## Arhitectura proiectului

```mermaid
graph TB
  subgraph docker [Docker Services]
    PG[PostgreSQL 15 - port 5432]
    Redis[Redis 7 - port 6379]
  end

  subgraph medusaApp [Medusa Application - port 9000]
    Backend[Node.js Server + API]
    Admin[Admin Dashboard - /app]
    Modules[Commerce Modules]
  end

  subgraph storefront [Next.js Storefront - port 8000]
    NextJS[Next.js App]
  end

  PG --> Backend
  Redis --> Backend
  Backend --> Admin
  Backend --> Modules
  NextJS -->|Store API| Backend
```



## Structura finala a directoarelor

```
demo-medusajs-dentstore/
  docker-compose.yml          # PostgreSQL + Redis
  my-medusa-store/             # Medusa backend + admin
    src/
      admin/                   # Admin widgets & UI routes
      api/                     # Custom API routes
      modules/                 # Custom modules
      workflows/               # Custom workflows
      subscribers/             # Event listeners
      scripts/                 # CLI scripts (seed, etc.)
    medusa-config.ts           # Configurari principale
    package.json
  my-medusa-store-storefront/  # Next.js storefront
    package.json
```

## Pasii de implementare

### Pas 1: Docker Compose pentru PostgreSQL si Redis

Cream `docker-compose.yml` in root-ul proiectului (`/Users/cosminsisman/dev/demo-medusajs-dentstore/`) cu:

- **PostgreSQL 15** pe port `5432` (user: `medusa`, pass: `medusa`, db: `medusa`)
- **Redis 7** pe port `6379`
- Volume persistent pentru date

Pornim serviciile cu `docker-compose up -d`.

### Pas 2: Creare proiect MedusaJS cu create-medusa-app

Rulam comanda:

```bash
yarn create medusa-app my-medusa-store --seed --db-url "postgres://medusa:medusa@localhost:5432/medusa"
```

La prompt:

- Alegem "Yes" pentru instalarea Next.js Starter Storefront
- Setam email + parola pentru admin user

Aceasta comanda:

- Creeaza directorul `my-medusa-store/` cu backend-ul Medusa
- Creeaza directorul `my-medusa-store-storefront/` cu storefront-ul Next.js
- Ruleaza migratiile bazei de date
- Populeaza cu date demo (flag `--seed`)
- Creeaza un user admin

### Pas 3: Verificare si configurare

- Verificam ca backend-ul porneste corect pe `http://localhost:9000`
- Verificam ca admin dashboard-ul e accesibil la `http://localhost:9000/app`
- Verificam ca storefront-ul Next.js merge pe `http://localhost:8000`
- Configurare CORS si environment variables in `medusa-config.ts`

### Pas 4: Seed data dental store

Dupa instalare, populam store-ul cu date specifice pentru un dental store:

- Cream categorii relevante (Instrumente, Materiale, Echipamente, Igienizare, etc.)
- Adaugam produse demo prin Admin Dashboard sau prin seed script
- Configurare regiune (RON / EUR), shipping, etc.

### Pas 5: Validare finala

- Build check: `yarn build` in directorul Medusa
- Testare flow complet: browse produse -> adaugare cos -> checkout
- Verificam ca admin dashboard-ul afiseaza produsele si comenzile

## Prerequisite verificate

- **Node.js v20+**: trebuie sa fie instalat (verificam la inceput)
- **Docker**: trebuie sa fie instalat si pornit
- **yarn**: trebuie sa fie instalat global
- **Git**: trebuie sa fie instalat

## Porturi utilizate

- `5432` -- PostgreSQL (Docker)
- `6379` -- Redis (Docker)
- `9000` -- Medusa Backend + Admin Dashboard
- `8000` -- Next.js Storefront

## Note importante

- MedusaJS v2 este complet gratuit si open source
- Datele sunt persistate local in volume Docker
- Storefront-ul Next.js NU suporta Node v25+ (trebuie v20-v24 LTS)
- `yarn` este recomandat de Medusa pentru viteza de instalare

