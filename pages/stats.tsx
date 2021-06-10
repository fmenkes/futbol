import superjson from 'superjson';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { Prisma } from '@prisma/client';
import prisma from '@lib/prisma';
import Leaderboard from '@components/Leaderboard';

const StatChart = dynamic(() => import('../components/StatChart'))

const userScores = Prisma.validator<Prisma.UserArgs>()({
    select: { scores: true, name: true },
  });
  
  export type UserScores = Prisma.UserGetPayload<typeof userScores>;
  
  type Props = {
    scores: UserScores[];
  };

const Stats: NextPage<Props> = ({ scores }) => {
    console.log(scores);
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
    const scores = await prisma.user.findMany({
      select: {
        name: true,
        scores: true,
        email: true,
      },
    });
  
    const scoresWithNames = scores.map((user) => ({
      ...user,
      name: user.name || user.email.split('@')[0],
    }));
  
    return {
      props: {
        scores: superjson.serialize(scoresWithNames).json,
      },
    };
  };

export default Stats;