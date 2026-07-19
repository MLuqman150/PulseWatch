# Stage - 1 builder  
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

# Stage - 2 runner
FROM node:20-alpine AS runner

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY --from=builder /app/prisma ./prisma

COPY --from=builder /app/dist ./dist

EXPOSE 4000

CMD ["node", "dist/main.js"]