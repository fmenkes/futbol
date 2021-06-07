import superjson from 'superjson';
import Leaderboard from '@components/Leaderboard';
import { GetServerSideProps, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { Match, PrismaClient, Prisma } from '@prisma/client';
import { Flex, HStack, SimpleGrid, VStack } from '@chakra-ui/layout';
import React, { useEffect } from 'react';
import MatchForm from '@components/MatchForm';
import prisma from '@lib/prisma';
import { withAuth } from 'hoc/withAuth';
import { Session } from 'next-auth';
import useSWR from 'swr';

const matchWithTeams = Prisma.validator<Prisma.MatchArgs>()({
  include: { homeTeam: true, awayTeam: true },
});

type MatchWithTeams = Prisma.MatchGetPayload<typeof matchWithTeams>;

type Props = {
  matches: MatchWithTeams[];
  session: Session;
};

const Matches: NextPage<Props> = ({ matches }) => {
  const { data } = useSWR('/api/predictions');

  return (
    <>
      <Head>
        <title>Fútbol</title>
      </Head>
      {/* <Leaderboard /> */}
      {/* TODO: Break out into its own components */}
      <VStack w={['full', 'container.sm']} mx="auto">
        {matches.map((match) => (
          <MatchForm match={match} data={data} />
        ))}
      </VStack>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const matches = await prisma.match.findMany({
    include: {
      homeTeam: true,
      awayTeam: true,
    },
  });

  return {
    props: {
      matches: superjson.serialize(matches).json,
    },
  };
};

export default withAuth(5 * 60)(Matches);
