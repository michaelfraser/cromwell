FROM node:18.20.6
WORKDIR /usr/src/app
CMD [ -d "node_modules" ] && npm run start || npm install --quiet && npm run start