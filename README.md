# Swiss Padel Stars

Application web moderne pour la gestion et la promotion du padel en Suisse.

## 🚀 Technologies Utilisées

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- React Router DOM
- Framer Motion
- Headless UI
- Hero Icons
- React Slick

### Backend
- PHP 8.2+
- Symfony 6.x
- MySQL/PostgreSQL
- API Platform

## 📋 Prérequis

- Node.js (v18 ou supérieur)
- PHP 8.2 ou supérieur
- Composer
- MySQL ou PostgreSQL
- Symfony CLI
- npm ou yarn

## 🛠 Installation

### Backend (Symfony)

1. Naviguer vers le dossier backend :
```bash
cd backend
```

2. Installer les dépendances PHP avec Composer :
```bash
composer install
```

3. Configurer la base de données :
- Créer une base de données MySQL/PostgreSQL
- Configurer les variables d'environnement dans le fichier `.env.local` :
```env
DATABASE_URL="mysql://user:password@127.0.0.1:3306/swiss_padel_stars?serverVersion=8.0"
```

4. Créer la base de données et exécuter les migrations :
```bash
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
```

5. Lancer le serveur Symfony :
```bash
symfony server:start
```

### Frontend

1. Naviguer vers le dossier frontend :
```bash
cd frontend
```

2. Installer les dépendances :
```bash
npm install
# ou
yarn install
```

3. Lancer le serveur de développement :
```bash
npm run dev
# ou
yarn dev
```

## 🌐 Accès à l'application

- Frontend : http://localhost:5173
- Backend API : http://localhost:8000
- Documentation API : http://localhost:8000/api/docs

## 📁 Structure du Projet

```
swiss-padel-stars/
├── frontend/           # Application React
│   ├── src/           # Code source
│   ├── public/        # Assets statiques
│   └── package.json   # Dépendances frontend
│
└── backend/           # API Symfony
    ├── src/          # Code source PHP
    ├── config/       # Configuration Symfony
    ├── migrations/   # Migrations de base de données
    └── composer.json # Dépendances PHP
```

## 🔧 Scripts Disponibles

### Frontend
- `npm run dev` : Lance le serveur de développement
- `npm run build` : Compile le projet pour la production
- `npm run lint` : Vérifie le code avec ESLint
- `npm run preview` : Prévisualise la version de production

### Backend
- `symfony server:start` : Lance le serveur de développement
- `php bin/console doctrine:migrations:migrate` : Exécute les migrations
- `php bin/console cache:clear` : Vide le cache
- `php bin/console doctrine:fixtures:load` : Charge les fixtures (si présentes)

## 📝 Documentation

- La documentation de l'API est disponible à l'adresse `/api/docs` une fois le serveur Symfony lancé
- La documentation technique détaillée se trouve dans le dossier `docs/`

## 🤝 Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails. 