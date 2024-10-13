# React-Node-MongoDB testé par Jest/React-testing-library/Mocha
![Stack (1)](https://github.com/user-attachments/assets/e5293f41-199c-4839-838f-04dcf3ef0a1e)  ![Tests (3)](https://github.com/user-attachments/assets/86d35847-92fd-4933-a32d-cf259642679e)


Projet démo 
Application basique de todo-list avec authentification sécurisée par token et privilèges administrateurs.
Utilisation de node 22..7.0 

Frontend
- Initialisation du projet avec Create React App
- Strucuration du projet en frontend/backend 
- Création des sections de la page d'accuei
- Création du composant Login
- Création du composant Logout
- Création du authService
- Création de l'affichage conditionnel lié à l'authentification
- Création des animations à la connexion
- Création du composant Todo-list
- Création du taskService
- Création du composant AdminDashboard 
- Adaptation de la logique de création des tâches via admin

Backend
- Initialisation du package.json avec npm init
- Installation des dépendances nécessaires (mongoose, express, bcrypt, helmet, jsonwebtoken, cors, cookie-parser)
- Configuration du server et de sa connexion à la base de données
- Création de la logique back d'authentification
- Stockage du token dans un cookie (httpOnly: false pour l'instant)
- Création de la logique backend pour les tâches (model, controller, routes)
- Création de la logiue pour admin 

Base de donnée
- Création de la base de données sur mongoDB avec l'email : les54yt@gmail.com
- Création de l'architecture avec les différents dossiers 
- Création du script implémentant la fonctionnalité similaire au CLR pour créé automatiquement un utilisateur admin 
- Ajustement du script pour créer automatiquement 3 utilisateurs (1 admin et 2 users) avec leur rôles si ils ne sont pas déjà créés


Tests frontend 
- Installation de Jest et React Testing Library 
- Installation de nvm en local pour gestionnaire de version Node
- Utilisation de la version LTS 20.17.0
- Création des tests pour les composants Login-Logout 
- Création des tests pour les services AuthService et CookieService
- Création du plan de test frontend sur figma
- Création des tests pour le service TaskService et pour le composant principal App
- Mise à jour du plan de tests sur figma

Tests backend 
- Installation des dépendances pour les tests 
- chai : assertion library pour écrire des tests
- chai-http : pour simuler des requêtes HTTP
- sinon : pour simuler et espionner des fonctions
- sinon-chai : pour intégrer sinon avec chai
- Intégrer le lancement des tests dans les scripts du package json : "test": "mocha --exclude 'node_modules/**' **/*.test.js",
- NB : Bien penser à exclure node_modules des tests pour éviter qu'il déclenche les tests en interne des dépendances 
