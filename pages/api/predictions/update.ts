import { NextApiHandler } from 'next';
import { getSession } from 'next-auth/client';

const update: NextApiHandler = async (req, res) => {
  const session = await getSession({ req });
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  const {
    homeTeam,
    awayTeam,
    matchId,
  }: { homeTeam: string; awayTeam: string; matchId: string } = req.body;

  let homeTeamGoals: number, awayTeamGoals: number, match: number;

  try {
    homeTeamGoals = parseInt(homeTeam, 10);
    awayTeamGoals = parseInt(awayTeam, 10);
    match = parseInt(matchId, 10);
  } catch {
    res.status(500).end();
  }

  const prediction = await prisma.prediction.upsert({
    where: {
      UserMatchKey: {
        userId: user.id,
        matchId: match,
      },
    },
    update: {
      homeTeamGoals,
      awayTeamGoals,
    },
    create: {
      userId: user.id,
      matchId: match,
      homeTeamGoals,
      awayTeamGoals,
    },
  });

  res.send(prediction);
};

export default update;
