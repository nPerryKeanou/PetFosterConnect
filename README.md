# !!!!!!!!!!!!!!!! I need to reconfigure the monorepo with Nx.


# Famille d'Accueil Animaux - Monorepo

Application web de mise en relation entre refuges et familles d'accueil pour animaux.

## Stack Technique

- **Backend**: NestJS + TypeScript + Prisma + PostgreSQL
- **Frontend**: React + TypeScript + Tailwind CSS + Vite
- **Monorepo**: npm workspaces

## Prérequis

- Node.js >= 18
- Docker & Docker Compose
- Port utilisé : 5433
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
    git checkout -b feature/nom-feature


2. Développer et commit
    git add .
    git commit -m "feat: description"


3. Push et créer une PR
    git push origin feature/nom-feature




## 🗄️ Base de données & Persistance

Le backend utilise **NestJS**, **Prisma 7** et **PostgreSQL** (via Docker). L'architecture est conçue pour être isolée et facile à reproduire.

### 1. Prérequis
* Docker & Docker Compose installés.
* Node.js (v18+) et npm.

### 2. Lancement de la Base de Données (Docker)
L'infrastructure PostgreSQL est containerisée. Pour démarrer le service, placez-vous à la racine du projet :

```Bash
    docker-compose up -d
```

# Documentation Base de données & Persistance
Voici les instructions spécifiques pour configurer la base de données sur le port 5440 et utiliser les commandes adaptées à Prisma 7 afin d'éviter les erreurs de configuration rencontrées lors du setup initial.

## Guide de démarrage rapide
### 1. Prérequis

Docker & Docker Compose installés.

Node.js (v18+) et npm.

### 2. Lancement de la Base de Données (Docker)

L'infrastructure PostgreSQL est containerisée. Pour démarrer le service, placez-vous à la racine du projet :

```Bash
    docker-compose up -d
```

Note : La base est exposée sur le port 5440 pour éviter les conflits avec d'éventuelles instances PostgreSQL locales (5432).

### 3. Configuration du Backend

Naviguez dans le dossier backend : cd apps/backend

Créez un fichier .env (si non présent) et configurez l'URL de connexion :

Extrait de code
    DATABASE_URL="postgresql://johndoe:randompassword@localhost:5440/petfosterconnect?schema=public"

#### 4. Initialisation de Prisma (Migration & Client)

Depuis le dossier apps/backend, lancez les commandes suivantes pour synchroniser votre base et générer le client TypeScript :

## 1. Installation des dépendances de configuration Prisma 7
```Bash
npm install --save-dev dotenv @prisma/config
```

## 2. Lancement de la migration (création des tables dans PostgreSQL)
```Bash
NODE_CONFIG_STRATEGY=none npx prisma migrate dev --name init_db --schema=./prisma/schema.prisma
```

## 3. Génération du client Prisma (pour l'autocomplétion TypeScript)
```Bash
npx prisma generate --schema=./prisma/schema.prisma
```
5. Exploration des données (Interface Graphique)

Pour inspecter visuellement le contenu de la base de données (Prisma Studio) :

```Bash
npx prisma studio --config=./prisma.config.ts
```

🏗️ Architecture Technique
Prisma 7 : Utilisation du fichier prisma.config.ts pour la gestion de la connexion, séparée du schema.prisma.

PrismaService : Module global NestJS. Une fois injecté, il permet d'accéder à la DB via this.prisma.user, this.prisma.animal, etc.

Migrations : Toutes les modifications de structure sont tracées dans prisma/migrations/. Ne jamais modifier la DB manuellement, passez toujours par le schéma.

💡 Conseils pour le déploiement et Git
Migrations : Pensez à inclure le dossier apps/backend/prisma/migrations dans vos commits. C'est ce dossier qui contient l'historique SQL indispensable pour que les autres collaborateurs aient la même base.

Sécurité : Vérifiez que votre fichier .gitignore exclut bien les fichiers .env pour ne pas exposer les identifiants de la base de données sur le dépôt distant.

## Contributeurs

- Développeur 1 - nPerryKeanou
- Développeur 2 - Leo-Fauquembergue
- Développeur 3 - Vincent-Couturier
- Développeur 4 - proed59
