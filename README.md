# MyInsta

![Logo](public/logo.png)

> **MyInsta** — Un clone moderne d’Instagram, développé avec Next.js, Prisma et Tailwind CSS.

---

## 🚀 Fonctionnalités

- Authentification sécurisée (NextAuth)
- Fil d’actualité, posts, likes, commentaires
- Messagerie privée en temps réel
- Gestion des profils et avatars
- Upload d’images (UploadThing)
- Notifications, reels, recherche
- UI responsive et dark mode
- Accessibilité optimisée

---

## 📦 Stack technique

- **Next.js 14** — Framework React fullstack
- **Prisma** — ORM & migrations
- **PostgreSQL** — Base de données
- **Tailwind CSS** — Design moderne
- **NextAuth** — Authentification
- **UploadThing** — Upload fichiers/images

---

## 🛠️ Installation

```bash
git clone https://github.com/mibegerard/next-instagram.git
cd next-instagram
npm install
```

---

## ⚡ Démarrer le projet

```bash
npm run dev
```

Accédez à [http://localhost:3000](http://localhost:3000)

---

## 🗂️ Structure du projet

```
app/           # Pages & routes Next.js
components/    # UI & composants réutilisables
lib/           # Fonctions utilitaires
prisma/        # Modèles & migrations
public/        # Images, favicon, logo
scripts/       # Scripts de seed & maintenance
```

---

## 🔒 Authentification

- Inscription et connexion via NextAuth
- Gestion des sessions et sécurité

---

## 💬 Messagerie

- Conversations privées
- Affichage avatars, usernames
- Envoi et réception en temps réel

---

## 🎨 UI & Accessibilité

- Design épuré, responsive
- Dark mode natif
- Composants accessibles (aria, focus)

---

## 📸 Upload d’images

- Drag & drop, preview
- Stockage sécurisé

---

## 📝 Scripts utiles

- `npm run seed` — Remplir la base avec des données de test
- `npm run build` — Build production

---

## 🧑‍💻 Auteur

- Gérard Mibe
- [github.com/mibegerard](https://github.com/mibegerard)

---

## 📄 Licence

MIT

---

## ⭐️ Star le repo si tu aimes le projet !

---

```git
# Clone, installe et démarre en 3 commandes
$ git clone ...
$ cd ...
$ npm install && npm run dev
```
