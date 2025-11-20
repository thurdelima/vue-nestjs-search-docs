FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN apk add --no-cache python3 make g++

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY data-source.ts ./data-source.ts
COPY src ./src

RUN npm rebuild bcrypt --build-from-source

EXPOSE 3000

CMD ["sh", "-c", "npm run migration:run && npm run seed && npm run start:prod"]

