import superjson from 'superjson';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { Prisma, MatchStatus } from '@prisma/client';
import { VStack } from '@chakra-ui/layout';
import React, { useState } from 'react';
import MatchForm from '@components/MatchForm';
import prisma from '@lib/prisma';
import { withAuth } from 'hoc/withAuth';
import { Session } from 'next-auth';
import { Checkbox, Stack } from '@chakra-ui/react';

const matchWithTeams = Prisma.validator<Prisma.MatchArgs>()({
  include: { homeTeam: true, awayTeam: true },
});

type MatchWithTeams = Prisma.MatchGetPayload<typeof matchWithTeams>;

type Props = {
  matches: MatchWithTeams[];
  session: Session;
  shownMatches: MatchWithTeams[];
};


const Matches: NextPage<Props> = ({ matches }) => {
  const [showFinishedGames, setShowFinishedGames] = useState(true);
  return (
    <>
      <Head>
        <title>Fútbol</title>
      </Head>
      <Stack spacing={10} direction="row" w={['full', 'container.md']} mx="auto">
        <Checkbox colorScheme="green" defaultIsChecked onChange={(e) => setShowFinishedGames(e.target.checked)}>
          Show finished games
        </Checkbox>
      </Stack>
      <VStack w={['full', 'container.md']} mx="auto">
        {matches.map((match) => (
          showFinishedGames
            ? <MatchForm key={match.id} match={match} />
            : match.status === MatchStatus.FINISHED
              ? null
              : <MatchForm key={match.id} match={match} />
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
    orderBy: {
      utcDate: 'asc',
    },
  });

  return {
    props: {
      matches: superjson.serialize(matches).json,
    },
  };
};

export default withAuth(5 * 60)(Matches);
