import { NextApiHandler } from 'next';
import axios from 'axios';
import prisma from '@lib/prisma';
import { MatchStatus, PredictionResult } from '.prisma/client';
import { getProjectedResult } from 'utils';

const get: NextApiHandler = async (req, res) => {
  const id = req.query.id as string;

  const result = await axios.get(
    `https://api.football-data.org/v2/matches/${req.query.id}`,
    {
      headers: {
        'X-Auth-Token': process.env.FOOTBALL_DATA_API_TOKEN,
      },
    },
  );

  const { data, status } = result;

  if (status === 400) {
    return res.status(401).end();
  }

  const { match } = data;

  const adjustedHomeTeamGoals = (match.score.fullTime.homeTeam || 0) - (match.score.extraTime.homeTeam || 0) - (match.score.penalties.homeTeam || 0);
  const adjustedAwayTeamGoals = (match.score.fullTime.awayTeam || 0) - (match.score.extraTime.awayTeam || 0) - (match.score.penalties.awayTeam || 0);

  await prisma.match.update({
    where: {
      id: parseInt(id, 10),
    },
    data: {
      status: match.status,
      homeTeamGoals: adjustedHomeTeamGoals,
      awayTeamGoals: adjustedAwayTeamGoals,
    },
  });

  if (match.status === MatchStatus.FINISHED) {
    const projectedResult = getProjectedResult(
      adjustedHomeTeamGoals,
      adjustedAwayTeamGoals,
    );

    await prisma.prediction.updateMany({
      where: {
        AND: [
          {
            matchId: match.id,
          },
          {
            homeTeamGoals: adjustedHomeTeamGoals,
            awayTeamGoals: adjustedAwayTeamGoals,
          },
        ],
      },
      data: {
        result: PredictionResult.CORRECT,
      },
    });

    await prisma.prediction.updateMany({
      where: {
        AND: [
          {
            matchId: match.id,
          },
          {
            projectedResult,
          },
          {
            NOT: [
              {
                homeTeamGoals: adjustedHomeTeamGoals,
                awayTeamGoals: adjustedAwayTeamGoals,
              },
            ],
          },
        ],
      },
      data: {
        result: PredictionResult.PARTIAL,
      },
    });

    await prisma.prediction.updateMany({
      where: {
        AND: [
          {
            matchId: match.id,
          },
          {
            NOT: [
              {
                projectedResult,
              },
            ],
          },
        ],
      },
      data: {
        result: PredictionResult.INCORRECT,
      },
    });
  }

  res.end();
};

export default get;
