import { NextApiHandler } from 'next';
import { getSession } from 'next-auth/client';
import prisma from '@lib/prisma';

const get: NextApiHandler = async (req, res) => {
  const session = await getSession({ req });
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    res.status(401).end();
  }

  const predictions = await prisma.prediction.findMany({
    where: { userId: user.id },
  });

  res.send(predictions);
};

export default get;
