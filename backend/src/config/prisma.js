// CLIENTE PRISMA (único para toda a aplicação)
//
// Por que um único cliente? O Prisma abre um pool de conexões com o banco.
// Criar um cliente novo em cada arquivo desperdiça conexões e pode esgotar
// o limite do PostgreSQL. Exportamos UMA instância e todos os módulos
// importam esta.

import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();
