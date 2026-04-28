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
# Cache bust: Tue Apr 28 18:51:42 +04 2026
