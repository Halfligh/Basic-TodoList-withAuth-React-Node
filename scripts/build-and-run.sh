#!/bin/bash

# Variables de suivi des erreurs
frontend_tests_status="SUCCESS"
backend_tests_status="SUCCESS"

# Afficher le répertoire courant pour vérification
echo "Répertoire actuel : $(pwd)"

# Aller dans le répertoire frontend
if [ -d "frontend" ]; then
  cd frontend
  npm install
  CI=false npm run build
  echo "Build front React terminé"
  
  # Exécuter les tests du code React avec Jest & React Testing Library
  CI=false npm run test
  if [ $? -ne 0 ]; then
    echo "Les tests front-end ont échoué."
    frontend_tests_status="FAILURE"
  else
    echo "Les tests front-end ont réussi !"
  fi
  cd ..
else
  echo "Le répertoire frontend n'existe pas."
  exit 1
fi

# Aller dans le répertoire backend
if [ -d "backend" ]; then
  cd backend
  fi

  # Exécuter les tests du code Node avec Mocha et Chaï 
  npm test
  if [ $? -ne 0 ]; then
    echo "Les tests back-end ont échoué."
    backend_tests_status="FAILURE"
  else
    echo "Les tests back-end ont réussi !"
  fi

  # Démarrer l'application backend
  node server
  echo "Backend démarré"
  cd ..
else
  echo "Le répertoire backend n'existe pas."
  exit 1
fi

# Récapitulatif des résultats des tests
echo "======================="
echo "Résumé des tests"
echo "======================="
echo "Tests front-end : $frontend_tests_status"
echo "Tests back-end : $backend_tests_status"

# Si l'un des tests a échoué, retourner un code d'erreur
if [ "$frontend_tests_status" == "FAILURE" ] || [ "$backend_tests_status" == "FAILURE" ]; then
  echo "Un ou plusieurs tests ont échoué."
  exit 1
else
  echo "Tous les tests ont réussi !"
  exit 0
fi