# Famille d'Accueil Animaux - Monorepo

Application web de mise en relation entre refuges et familles d'accueil pour animaux.

## Stack Technique

- **Backend**: NestJS + TypeScript + Prisma + PostgreSQL
- **Frontend**: React + TypeScript + Tailwind CSS + Vite
- **Monorepo**: npm workspaces

## Prérequis

- Node.js >= 18
- Docker & Docker Compose
- npm >= 9

## Installation

1. Cloner le repo
```bash
git clone <url>
cd projet
```

2. Installer les dépendances
```bash
npm install
```

3. Lancer la base de données
```bash
npm run docker:up
```

4. Configurer les variables d'environnement
```bash
cp apps/backend/.env.example apps/backend/.env
# Éditer apps/backend/.env si nécessaire
```

5. Générer Prisma Client & lancer les migrations
```bash
npm run prisma:generate
npm run prisma:migrate
```

6. Lancer le projet en mode dev
```bash
npm run dev
```

- Backend: http://localhost:3001
- Frontend: http://localhost:5173
- Prisma Studio: `npm run prisma:studio`

## Scripts disponibles

- `npm run dev` - Lance backend + frontend en parallèle
- `npm run dev:backend` - Lance uniquement le backend
- `npm run dev:frontend` - Lance uniquement le frontend
- `npm run build` - Build complet
- `npm run docker:up` - Démarre PostgreSQL
- `npm run docker:down` - Arrête PostgreSQL
- `npm run prisma:generate` - Génère Prisma Client
- `npm run prisma:migrate` - Applique les migrations
- `npm run prisma:studio` - Ouvre Prisma Studio

## Structure du projet
```
apps/
├── backend/    - API NestJS
└── frontend/   - Application React
packages/
└── shared-types/  - Types TypeScript partagés
```

## Workflow Git

1. Créer une branche depuis `main`
```bash
git checkout -b feature/nom-feature
```

2. Développer et commit
```bash
git add .
git commit -m "feat: description"
```

3. Push et créer une PR
```bash
git push origin feature/nom-feature
```

## Contributeurs

- Développeur 1 - Backend
- Développeur 2 - Frontend
- Développeur 3 - Frontend
- Développeur 4 - Fullstack
