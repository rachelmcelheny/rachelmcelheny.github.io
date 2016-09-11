#!/bin/sh

while true; do
	read -p "Ready to release? (yes/no) " yn
	case $yn in
		[Yy]*) break;;
		[Nn]*) exit;;
		*) echo "Come on...";;
	esac
done

if [ "$( git rev-parse --abbrev-ref HEAD )" != "development" ]; then
	echo "You're not on the development branch. How're you running this script?"
	exit 1
fi

if [ ! -z "$( git status --porcelain )" ]; then
	echo "There's uncommitted code. Commit it!"
	exit 1
fi

git remote update
if [ ! -z "$( git status --porcelain -uno )" ]; then
	echo "Behind remote. Pull it!"
	exit 1
fi
git push

echo "Okay, starting the release!"

echo -e "\n\n\nPrepping..."
npm run clean

mkdir dist
cd dist
git init
git remote add origin git@github.com:rachelmcelheny/rachelmcelheny.github.io.git
git fetch
git checkout master
rm -rf *

echo -e "\n\n\nBuilding..."
npm run build
cp ../CNAME .

if [ -z "$( git status --porcelain )" ]; then
	echo "There's no change. No need to release!"
	cd ..
	exit 0
fi

echo -e "\n\n\nBuilt. Publishing..."
git add -A .
git commit -m "Publish site"
git push

cd ..

echo -e "\n\n\nDone!"
