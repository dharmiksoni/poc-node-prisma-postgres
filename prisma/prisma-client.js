const { PrismaClient } = require('@prisma/client');

// Add prisma to the NodeJS global object
// TODO: Downgraded @types/node to 15.14.1 to avoid errors on NodeJS.Global
global.prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') {
  global.prisma = global.prisma;
}

module.exports = global.prisma;
