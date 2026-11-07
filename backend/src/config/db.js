const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
require("dotenv").config();

// 1. Buat adapter dengan connection string dari .env
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

// 2. Masukkan adapter ke dalam PrismaClient
const prisma = new PrismaClient({ adapter });

module.exports = prisma;
