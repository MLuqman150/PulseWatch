# Stage - 1 builder  
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate --schema=apps/api/prisma/schema.prisma

RUN npm run build --workspace=apps/api

# Stage - 2 runner
FROM node:20-alpine AS runner

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY --from=builder /app/apps/api/prisma ./prisma

COPY --from=builder /app/apps/api/dist ./dist

EXPOSE 4000

CMD ["node", "dist/main.js"]