#!/bin/sh
set -e

echo "=========================================="
echo "🚀 Starting Netloka Production Container"
echo "=========================================="

echo "⚡ Ensuring database schema is synced..."
npx prisma db push --skip-generate || true

echo "🌱 Seeding initial curriculum data if needed..."
node -e "
const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();
async function check() {
  const count = await prisma.learningPath.count();
  if (count === 0) {
    console.log('Database empty, please seed or run db:seed');
  } else {
    console.log('Database already has ' + count + ' Learning Paths.');
  }
  await prisma.\$disconnect();
}
check().catch(console.error);
" || true

echo "🌐 Starting Netloka Server on http://0.0.0.0:3000..."
exec node server.js
