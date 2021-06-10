import { getSession } from 'next-auth/client';
import { PredictionResult, PrismaClient } from '@prisma/client';
import prisma from '@lib/prisma';

const prismaClient = new PrismaClient();

export default async (req, res) => {
  const scores = await prisma.prediction.findMany({
    where: {
      NOT: {
        result: PredictionResult.INCOMPLETE,
      },
    },
    include: {
      match: true,
    },
  });

  res.send(scores);
};
