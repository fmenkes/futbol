import { getSession } from 'next-auth/client';
import { PrismaClient } from '@prisma/client';

const prismaClient = new PrismaClient();

export default async (req, res) => {
  const session = await getSession({ req });

  const { role } = await prismaClient.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  console.log(role);

  res.send();
};
