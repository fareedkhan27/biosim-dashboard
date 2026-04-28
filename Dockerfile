FROM node:20-alpine
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000
ENV PORT=3000
CMD ["node", "dist/boot.js"]

# Cache bust: rebuild trigger v2
