#!/usr/bin/env bash
# =========================================================
# Script d'initialisation du repo SUNU MALL.
#
# Utilisation :
#   1. Crée d'abord un repo PRIVÉ vide sur GitHub, nommé "sunu-mall"
#      (ne PAS cocher "Initialize with README" pour éviter un conflit)
#   2. Dézippe ce contenu dans un dossier
#   3. Édite l'URL ci-dessous (remplace <organisation-ou-pseudo>)
#   4. Lance : bash init-git.sh
# =========================================================
set -e

REPO_URL="git@github.com:MouhaBerre/Sunu_Mall.git"

git init
git add .
git commit -m "chore: structure initiale du mono-repo SUNU MALL"

git branch -M main
git remote add origin "$REPO_URL"
git push -u origin main

# On crée develop à partir de main, comme convenu dans CONTRIBUTING.md
git checkout -b develop
git push -u origin develop

echo ""
echo "C'est fait. Pense à :"
echo "  1. Aller dans Settings > Branches sur GitHub et protéger main + develop"
echo "     (require pull request before merging, require status checks to pass)"
echo "  2. Remplacer les pseudos dans .github/CODEOWNERS par les vrais comptes GitHub"
echo "  3. Inviter Bouba, Ngoné, Sokhna et PAF comme collaborateurs du repo"
