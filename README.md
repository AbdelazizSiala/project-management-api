# API de gestion de projets et de tâches

## Mini-projet DS1, ISIDS

**Auteur :** Abdelaziz Siala

---

## 1. Présentation du projet

Ce projet consiste à développer une API REST permettant de gérer des projets et les tâches qui leur sont associées.

L'API permet aux utilisateurs de créer un compte, de s'authentifier, de gérer leurs projets et leurs tâches, ainsi que de rechercher, filtrer et trier les données.

Deux rôles sont disponibles :

- **Utilisateur (`user`) :** peut créer et gérer ses propres projets et les tâches associées.
- **Gestionnaire (`manager`) :** dispose de droits supplémentaires, notamment la consultation de tous les projets et de toutes les tâches, ainsi que l'assignation des tâches aux utilisateurs.

L'API utilise MongoDB pour le stockage des données et les JSON Web Tokens (JWT) pour l'authentification.

## 2. Technologies utilisées

- **Node.js :** environnement d'exécution JavaScript.
- **Express.js :** framework utilisé pour développer l'API REST.
- **MongoDB :** base de données NoSQL.
- **Mongoose :** modélisation des données et interaction avec MongoDB.
- **jsonwebtoken :** création et vérification des tokens JWT.
- **bcryptjs :** hachage des mots de passe.
- **express-validator :** validation des données reçues dans les requêtes.
- **cors :** gestion des requêtes Cross-Origin.
- **dotenv :** chargement des variables d'environnement.
- **Nodemon :** redémarrage automatique du serveur pendant le développement.

## 3. Structure du projet

```text
project-management-api/
│
├── src/
│   ├── config/
│   │   └── database.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   └── taskController.js
│   │
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   ├── validationMiddleware.js
│   │   └── errorMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Task.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   └── taskRoutes.js
│   │
│   ├── validators/
│   │   ├── authValidators.js
│   │   ├── projectValidators.js
│   │   └── taskValidators.js
│   │
│   └── server.js
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── requests.http
└── README.md
```

### Organisation du code

- **config :** configuration et connexion à la base de données.
- **controllers :** logique métier et traitement des requêtes.
- **middlewares :** authentification, autorisation, validation et gestion centralisée des erreurs.
- **models :** définition des schémas MongoDB avec Mongoose.
- **routes :** définition des endpoints de l'API.
- **validators :** règles de validation des données reçues.

## 4. Installation et lancement

### Prérequis

- Node.js et npm installés.
- Un accès à une base de données MongoDB.

### Installation

Cloner le dépôt :

```bash
git clone <URL_DU_DEPOT>
```

Accéder au dossier du projet :

```bash
cd project-management-api
```

Installer les dépendances :

```bash
npm install
```

### Configuration de l'environnement

Le fichier `.env` contient les variables nécessaires au fonctionnement de l'application.

Pour préparer ce fichier, copier le modèle fourni :

```bash
cp .env.example .env
```

Sous Windows PowerShell :

```powershell
Copy-Item .env.example .env
```

Ensuite, renseigner les valeurs nécessaires :

```env
PORT=3000
MONGODB_URI=<URI_DE_CONNEXION_MONGODB>
JWT_SECRET=<CLE_SECRETE_JWT>
```

- `PORT` : port utilisé par le serveur.
- `MONGODB_URI` : URI de connexion à la base de données MongoDB.
- `JWT_SECRET` : clé secrète utilisée pour signer et vérifier les tokens JWT.

### Lancement du serveur

En mode développement :

```bash
npm run dev
```

En mode normal :

```bash
npm start
```

Par défaut, l'API est accessible à l'adresse :

`http://localhost:3000`

La route principale `/` permet de vérifier que le serveur fonctionne.

## 5. Modèles de données

L'application utilise trois modèles principaux.

### 5.1 Utilisateur (User)

| Attribut | Description |
|---|---|
| `nom` | Nom de l'utilisateur |
| `login` | Identifiant unique |
| `password` | Mot de passe haché |
| `role` | Rôle : `user` ou `manager` |
| `createdAt` | Date de création |
| `updatedAt` | Date de modification |

Les mots de passe sont hachés avec bcryptjs avant leur enregistrement dans la base de données.

Le rôle est défini par défaut à `user` lors de l'inscription.

### 5.2 Projet (Project)

| Attribut | Description |
|---|---|
| `nom` | Nom du projet |
| `description` | Description du projet |
| `owner` | Référence vers le propriétaire du projet |
| `status` | État du projet |
| `createdAt` | Date de création |
| `updatedAt` | Date de modification |

Les statuts possibles sont :

- `in progress`
- `completed`
- `paused`

Le propriétaire est automatiquement récupéré à partir du token JWT de l'utilisateur authentifié.

### 5.3 Tâche (Task)

| Attribut | Description |
|---|---|
| `title` | Titre de la tâche |
| `description` | Description de la tâche |
| `status` | État de la tâche |
| `deadline` | Date limite |
| `project` | Référence vers le projet associé |
| `assignedTo` | Référence vers l'utilisateur assigné |
| `createdAt` | Date de création |
| `updatedAt` | Date de modification |

Les statuts possibles sont :

- `todo`
- `doing`
- `done`

Chaque tâche est associée à un projet. L'utilisateur auquel une tâche est assignée est représenté par une référence vers un document User.

## 6. Authentification et autorisation

L'authentification repose sur les JSON Web Tokens (JWT).

Après une connexion réussie, l'API retourne un token contenant notamment l'identifiant et le rôle de l'utilisateur. Ce token est valide pendant 24 heures.

Le client doit envoyer ce token dans l'en-tête HTTP des requêtes protégées :

```http
Authorization: Bearer <TOKEN>
```

Le middleware d'authentification vérifie la validité du token et récupère les informations de l'utilisateur.

Un middleware d'autorisation permet ensuite de vérifier si l'utilisateur possède le rôle nécessaire pour effectuer certaines opérations.

### Gestion des rôles et permissions

| Fonctionnalité | Utilisateur | Gestionnaire |
|---|:---:|:---:|
| Créer un projet | Oui | Oui |
| Consulter ses projets | Oui | Oui |
| Consulter tous les projets | Non | Oui |
| Modifier ses propres projets | Oui | Oui |
| Modifier les projets des autres utilisateurs | Non | Non |
| Supprimer ses propres projets | Oui | Oui |
| Supprimer les projets des autres utilisateurs | Non | Non |
| Créer des tâches dans ses propres projets | Oui | Oui |
| Créer des tâches dans les projets des autres utilisateurs | Non | Oui |
| Consulter les tâches de ses propres projets | Oui | Oui |
| Consulter toutes les tâches | Non | Oui |
| Modifier et supprimer les tâches | Selon les autorisations | Oui |
| Assigner une tâche à un utilisateur | Non | Oui |

**Remarque :** le rôle `manager` n'est pas attribué lors de l'inscription. Les nouveaux comptes reçoivent automatiquement le rôle `user`. La création d'un gestionnaire nécessite donc une modification directe du rôle dans la base de données.

## 7. Endpoints de l'API

Toutes les requêtes utilisant un corps JSON doivent inclure l'en-tête suivant :

```http
Content-Type: application/json
```

Les endpoints protégés nécessitent également un token JWT valide.

### 7.1 Authentification

| Méthode | Endpoint | Description | Authentification |
|---|---|---|---|
| POST | `/register` | Inscription d'un utilisateur | Non |
| POST | `/login` | Connexion d'un utilisateur | Non |

#### Inscription

`POST /register`

Exemple de corps JSON :

```json
{
  "nom": "Ahmed",
  "login": "ahmed123",
  "password": "password123"
}
```

Une inscription réussie retourne les informations de l'utilisateur créé, sans retourner son mot de passe.

#### Connexion

`POST /login`

Exemple de corps JSON :

```json
{
  "login": "ahmed123",
  "password": "password123"
}
```

Une connexion réussie retourne un token JWT à utiliser dans les requêtes protégées.

### 7.2 Gestion des projets

| Méthode | Endpoint | Description | Authentification |
|---|---|---|---|
| POST | `/projects` | Créer un projet | Oui |
| GET | `/projects` | Consulter les projets accessibles | Oui |
| PATCH | `/projects/:id` | Modifier un projet | Oui |
| DELETE | `/projects/:id` | Supprimer un projet | Oui |

#### Création d'un projet

`POST /projects`

```json
{
  "nom": "Application mobile",
  "description": "Développement d'une application mobile"
}
```

Le propriétaire du projet est automatiquement défini à partir de l'utilisateur authentifié.

Le statut est facultatif et prend par défaut la valeur `in progress`.

#### Modification d'un projet

`PATCH /projects/:id`

```json
{
  "nom": "Application mobile V2",
  "status": "in progress"
}
```

Les champs modifiables sont `nom`, `description` et `status`. Au moins un champ doit être fourni.

### 7.3 Gestion des tâches

| Méthode | Endpoint | Description | Authentification |
|---|---|---|---|
| POST | `/tasks` | Créer une tâche | Oui |
| GET | `/tasks` | Consulter les tâches accessibles | Oui |
| PATCH | `/tasks/:id` | Modifier une tâche | Oui |
| DELETE | `/tasks/:id` | Supprimer une tâche | Oui |
| PATCH | `/tasks/:id/assign` | Assigner une tâche à un utilisateur | Gestionnaire uniquement |

#### Création d'une tâche

`POST /tasks`

```json
{
  "title": "Créer la page de connexion",
  "description": "Développer l'interface de connexion",
  "deadline": "2026-12-20",
  "project": "<ID_DU_PROJET>"
}
```

Le champ `project` doit contenir l'identifiant MongoDB du projet associé.

Un utilisateur standard peut uniquement créer des tâches dans ses propres projets. Un gestionnaire peut également créer des tâches dans les projets des autres utilisateurs.

Le statut est facultatif et prend par défaut la valeur `todo`.

#### Modification d'une tâche

`PATCH /tasks/:id`

```json
{
  "title": "Finaliser la page de connexion",
  "status": "doing"
}
```

Les champs modifiables sont `title`, `description`, `status` et `deadline`. Au moins un champ doit être fourni.

#### Assignation d'une tâche

`PATCH /tasks/:id/assign`

Cette opération est réservée aux gestionnaires.

```json
{
  "assignedTo": "<ID_DE_L_UTILISATEUR>"
}
```

Le champ `assignedTo` doit contenir l'identifiant MongoDB d'un utilisateur existant.

## 8. Recherche, filtrage et tri

L'API permet de rechercher, filtrer et trier les projets et les tâches à l'aide de paramètres de requête (query parameters).

### 8.1 Projets

Endpoint :

`GET /projects`

| Paramètre | Description |
|---|---|
| `search` | Recherche dans le nom et la description |
| `status` | Filtrage par statut |
| `sortBy` | Champ de tri : `nom`, `status` ou `createdAt` |
| `order` | Ordre de tri : `asc` ou `desc` |

Exemple :

```http
GET /projects?search=mobile&status=in%20progress&sortBy=createdAt&order=desc
```

Le tri par défaut utilise `createdAt` dans l'ordre décroissant.

Un utilisateur standard ne voit que ses propres projets, tandis qu'un gestionnaire peut consulter tous les projets.

### 8.2 Tâches

Endpoint :

`GET /tasks`

| Paramètre | Description |
|---|---|
| `search` | Recherche dans le titre et la description |
| `status` | Filtrage par statut |
| `project` | Filtrage par identifiant du projet |
| `assignedTo` | Filtrage par utilisateur assigné |
| `deadlineFrom` | Date limite minimale |
| `deadlineTo` | Date limite maximale |
| `sortBy` | Champ de tri : `title`, `status`, `deadline` ou `createdAt` |
| `order` | Ordre de tri : `asc` ou `desc` |

Exemple :

```http
GET /tasks?status=doing&sortBy=deadline&order=asc
```

Exemple avec plusieurs filtres :

```http
GET /tasks?project=<ID_DU_PROJET>&status=todo&deadlineFrom=2026-12-01&deadlineTo=2026-12-31
```

Les filtres peuvent être combinés dans une même requête.

Le tri par défaut utilise `createdAt` dans l'ordre décroissant.

Un utilisateur standard ne voit que les tâches appartenant à ses propres projets, tandis qu'un gestionnaire peut consulter toutes les tâches.

## 9. Validation et gestion des erreurs

L'application utilise `express-validator` pour vérifier les données reçues avant leur traitement par les contrôleurs.

Les validations portent notamment sur :

- La présence et le type des champs obligatoires.
- Les valeurs autorisées pour les statuts.
- La validité des identifiants MongoDB.
- Le format des dates.
- La présence d'au moins un champ lors d'une modification.
- La validité des paramètres de recherche et de tri.

Les erreurs sont traitées à l'aide de deux types de middlewares :

- **Validation middleware :** vérifie les erreurs de validation et retourne les détails des champs invalides.
- **Error middleware :** centralise le traitement des erreurs provenant des contrôleurs et des routes.

### Principaux codes HTTP utilisés

| Code | Signification |
|---|---|
| 200 | Requête réussie |
| 201 | Ressource créée |
| 400 | Requête invalide ou données incorrectes |
| 401 | Authentification requise ou token invalide |
| 403 | Accès interdit |
| 404 | Ressource ou route introuvable |
| 409 | Conflit, par exemple un identifiant déjà utilisé |
| 500 | Erreur interne du serveur |

En cas d'erreur de validation, l'API retourne également des informations sur les champs concernés.

## 10. Tests de l'API

Le fichier `requests.http` contient des exemples de requêtes HTTP permettant de tester les différentes fonctionnalités de l'API.

Ces requêtes peuvent être exécutées directement depuis Visual Studio Code avec l'extension REST Client.

Les tests couvrent notamment :

- L'inscription et la connexion.
- L'authentification avec JWT.
- La création, la consultation, la modification et la suppression des projets.
- La création et la gestion des tâches.
- L'assignation des tâches par les gestionnaires.
- La recherche, le filtrage et le tri.
- La validation des données.
- Les restrictions liées aux rôles.
- La gestion des erreurs et des routes inexistantes.

## 11. Remarque concernant le fichier `.env`

Le fichier `.env` contient des informations sensibles, notamment les identifiants de connexion à la base de données et la clé secrète utilisée pour les tokens JWT.

Pour cette raison, le fichier `.env` réel n'est volontairement pas inclus dans le dépôt GitHub. Il est ignoré grâce au fichier `.gitignore`, afin d'éviter d'exposer des identifiants et des informations confidentielles.

À sa place, le dépôt contient un fichier `.env.example` qui présente les variables nécessaires à la configuration de l'application, sans révéler leurs valeurs réelles.

Cette séparation permet de faciliter l'installation et les tests du projet tout en respectant les bonnes pratiques de sécurité.

Chaque personne souhaitant exécuter le projet doit créer son propre fichier `.env` à partir de `.env.example` et renseigner ses propres informations de connexion.

---

**Fin du README**