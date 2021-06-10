import { getSession } from 'next-auth/client';
import { PrismaClient } from '@prisma/client';
import prisma from '@lib/prisma';

const prismaClient = new PrismaClient();

export default async (req, res) => {
  const scores = await prisma.prediction.findMany({
    where: {
      matchId: 285419
    },
    include: {
      user: {
        select: {
          name: true,
        }
      }
    }
  });

  res.send(scores);
};
