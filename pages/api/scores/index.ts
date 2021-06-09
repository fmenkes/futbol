import { NextApiHandler } from 'next';
import { getSession } from 'next-auth/client';
import prisma from '@lib/prisma';

const get: NextApiHandler = async (req, res) => {
  const scores = await prisma.user.findMany({
    select: {
      name: true,
      scores: true,
    },
  });

  res.send(scores);
};

export default get;
