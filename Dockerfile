# Használjuk a Node.js alapú képet
FROM node:latest

# Állítsuk be a munkakönyvtárat a kód másolásához
WORKDIR /usr/src/app

# Másoljuk át a szükséges fájlokat és mappákat a konténerbe
COPY package.json ./
COPY package-lock.json ./
COPY . ./

# Telepítsük a szükséges függőségeket
RUN npm install

# Indítsuk el az alkalmazást a `npm start` paranccsal
CMD ["npm", "start"]
