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

  console.log(
    match.status,
    match.score.fullTime.homeTeam,
    match.score.fullTime.awayTeam,
  );

  await prisma.match.update({
    where: {
      id: parseInt(id, 10),
    },
    data: {
      status: match.status,
      homeTeamGoals: match.score.fullTime.homeTeam || 0,
      awayTeamGoals: match.score.fullTime.awayTeam || 0,
    },
  });

  if (match.status === MatchStatus.FINISHED) {
    const projectedResult = getProjectedResult(
      match.score.fullTime.homeTeam,
      match.score.fullTime.awayTeam,
    );

    await prisma.prediction.updateMany({
      where: {
        AND: [
          {
            matchId: match.id,
          },
          {
            homeTeamGoals: match.score.fullTime.homeTeam,
            awayTeamGoals: match.score.fullTime.awayTeam,
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
                homeTeamGoals: match.score.fullTime.homeTeam,
                awayTeamGoals: match.score.fullTime.awayTeam,
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
