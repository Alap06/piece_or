# Pièces d'Or de Mahdia — MERN Stack

Plateforme culturelle professionnelle de valorisation des pièces patrimoniales en or de Mahdia.

## 🚀 Technologies

- **Frontend** : React 18, Vite, Tailwind CSS (Design Premium), Zustand, i18next
- **Backend** : Node.js, Express.js, MongoDB Atlas, Mongoose
- **Auth** : JWT (Access + Refresh tokens)
- **Upload** : Cloudinary (Images & PDF)

## 📦 Installation (Locale)

### 1. Cloner et configurer
```bash
# Variables d'environnement
# Créer .env dans /backend et copier le contenu depuis l'exemple
```

### 2. Démarrer le Backend
```bash
cd backend
npm install
npm run seed  # Optionnel : génère 6 pièces de test
npm run dev
```

> **Note** : Le serveur backend créera automatiquement un compte administrateur au démarrage s'il n'existe pas :
> - **Email** : `admin@mahdia.tn`
> - **Mot de passe** : `Admin@2026`

### 3. Démarrer le Frontend
```bash
cd frontend
npm install
npm run dev
```

La plateforme sera disponible sur `http://localhost:5173`.

## 🐳 Déploiement Docker

Pour lancer toute la stack (Frontend + Backend + MongoDB en local) avec Docker :

```bash
docker-compose up --build -d
```

- Frontend : `http://localhost:5173`
- Backend : `http://localhost:5000`
- Base de données locale (optionnelle, selon `.env`) : `localhost:27017`

## 📁 Architecture

```text
projet/
├── backend/            # Serveur Express, Modèles Mongoose, Routes API
│   ├── config/         # MongoDB & Cloudinary
│   ├── controllers/    # Logique métier
│   ├── middleware/     # Auth JWT & Upload Multer
│   ├── models/         # Schémas BDD
│   ├── routes/         # Endpoints REST
│   └── seeds/          # Données de test
└── frontend/           # Application React (Vite)
    ├── src/
    │   ├── api/        # Appels Axios
    │   ├── components/ # UI (Header, Footer, Cards)
    │   ├── contexts/   # i18n & Theme
    │   ├── i18n/       # Traductions (FR, EN, AR)
    │   ├── layouts/    # Public & Admin
    │   ├── pages/      # Pages React
    │   └── store/      # Zustand State
```
