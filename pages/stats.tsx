import superjson from 'superjson';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { PredictionResult, Prisma, Stage } from '@prisma/client';
import prisma from '@lib/prisma';
import Leaderboard from '@components/Leaderboard';
import { withAuth } from 'hoc/withAuth';

const StatChart = dynamic(() => import('../components/StatChart'));

const userScores = Prisma.validator<Prisma.UserArgs>()({
  select: { scores: true, name: true },
});

export type UserScores = Prisma.UserGetPayload<typeof userScores>;

type Props = {
  scores: UserScores[];
};

const Stats: NextPage<Props> = ({ scores }) => {
  return (
    <>
      <Head>
        <title>Stats</title>
      </Head>
      <Leaderboard scores={scores} />
      <StatChart scores={scores} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {
    partialPoints,
    correctPoints,
  } = await prisma.adminSettings.findFirst();

  const users = await prisma.user.findMany({
    include: {
      predictions: {
        where: {
          NOT: {
            result: PredictionResult.INCOMPLETE,
          },
        },
        include: {
          match: true,
        },
      },
    },
  });

  const matchdays = [
    'Matchday 1',
    'Matchday 2',
    'Matchday 3',
    'Round of 16',
    'Quarter Finals',
    'Semi Finals',
    'Final',
  ];

  const scoresWithNames = users.map((user) => ({
    name: user.name || user.email.split('@')[0],
    scores: matchdays.map((matchday) => {
      let score = 0;
      switch (matchday) {
        case 'Matchday 1':
          const matchdayOnePredictions = user.predictions.filter(
            (p) => p.match.matchday === 1,
          );

          matchdayOnePredictions.forEach((p) => {
            score +=
              p.result === PredictionResult.CORRECT
                ? correctPoints
                : p.result === PredictionResult.PARTIAL
                ? partialPoints
                : 0;
          });
          break;
        case 'Matchday 2':
          const matchdayTwoPredictions = user.predictions.filter(
            (p) => p.match.matchday === 2,
          );
          matchdayTwoPredictions.forEach((p) => {
            score +=
              p.result === PredictionResult.CORRECT
                ? correctPoints
                : p.result === PredictionResult.PARTIAL
                ? partialPoints
                : 0;
          });
          break;
        case 'Matchday 3':
          const matchdayThreePredictions = user.predictions.filter(
            (p) => p.match.matchday === 3,
          );
          matchdayThreePredictions.forEach((p) => {
            score +=
              p.result === PredictionResult.CORRECT
                ? correctPoints
                : p.result === PredictionResult.PARTIAL
                ? partialPoints
                : 0;
          });
          break;
        case 'Round of 16':
          const roundOfSixteenPredictions = user.predictions.filter(
            (p) => p.match.stage === Stage.LAST_16,
          );
          roundOfSixteenPredictions.forEach((p) => {
            score +=
              p.result === PredictionResult.CORRECT
                ? correctPoints
                : p.result === PredictionResult.PARTIAL
                ? partialPoints
                : 0;
          });
          break;
        case 'Quarter Finals':
          const quarterFinalsPredictions = user.predictions.filter(
            (p) => p.match.stage === Stage.QUARTER_FINAL,
          );
          quarterFinalsPredictions.forEach((p) => {
            score +=
              p.result === PredictionResult.CORRECT
                ? correctPoints
                : p.result === PredictionResult.PARTIAL
                ? partialPoints
                : 0;
          });
          break;
        case 'Semi Finals':
          const semiFinalsPredictions = user.predictions.filter(
            (p) => p.match.stage === Stage.SEMI_FINAL,
          );
          semiFinalsPredictions.forEach((p) => {
            score +=
              p.result === PredictionResult.CORRECT
                ? correctPoints
                : p.result === PredictionResult.PARTIAL
                ? partialPoints
                : 0;
          });
          break;
        case 'Final':
          const finalPredictions = user.predictions.filter(
            (p) => p.match.stage === Stage.FINAL,
          );
          finalPredictions.forEach((p) => {
            score +=
              p.result === PredictionResult.CORRECT
                ? correctPoints
                : p.result === PredictionResult.PARTIAL
                ? partialPoints
                : 0;
          });
          break;
      }
      return score;
    }),
  }));

  return {
    props: {
      scores: superjson.serialize(scoresWithNames).json,
    },
  };
};

export default withAuth(5 * 60)(Stats);
