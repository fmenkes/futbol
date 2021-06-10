import { MatchStatus } from '.prisma/client';
import prisma from '@lib/prisma';
import { NextApiHandler } from 'next';

const get: NextApiHandler = async (req, res) => {
  const id = req.query.id as string;

  const match = await prisma.match.findUnique({
    where: {
      id: parseInt(id, 10),
    },
  });

  if (
    !(
      match.status === MatchStatus.IN_PLAY ||
      match.status === MatchStatus.FINISHED
    )
  ) {
    res.status(403).end();
  }

  const scores = await prisma.prediction.findMany({
    where: {
      matchId: match.id,
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  const scoresWithNames = scores.map((prediction) => ({
    ...prediction,
    user: {
      name: prediction.user.name || prediction.user.email.split('@')[0],
    },
  }));

  res.send(scoresWithNames);
};

export default get;
