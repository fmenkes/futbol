import superjson from 'superjson';
import Leaderboard from '@components/Leaderboard';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { Prisma } from '@prisma/client';
import prisma from '@lib/prisma';

const userScores = Prisma.validator<Prisma.UserArgs>()({
  select: { scores: true, name: true },
});

export type UserScores = Prisma.UserGetPayload<typeof userScores>;

type Props = {
  scores: UserScores[];
};

const Home: NextPage<Props> = ({ scores }) => {
  console.log(scores);
  return (
    <>
      <Head>
        <title>Fútbol</title>
      </Head>
      <Leaderboard scores={scores} />
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
    name: user.name || user.email.split('@')[0],
    scores: user.scores,
  }));

  return {
    props: {
      scores: superjson.serialize(scoresWithNames).json,
    },
  };
};

export default Home;
