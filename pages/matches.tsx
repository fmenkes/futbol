import superjson from 'superjson';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { Prisma, MatchStatus } from '@prisma/client';
import { Divider, VStack } from '@chakra-ui/layout';
import React, { useState } from 'react';
import MatchForm from '@components/MatchForm';
import prisma from '@lib/prisma';
import { withAuth } from 'hoc/withAuth';
import { Session } from 'next-auth';
import { Box, Checkbox, Stack } from '@chakra-ui/react';

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
  // TODO: Can be gotten from user settings if that is ever implemented
  const [showFinishedGames, setShowFinishedGames] = useState(false);
  return (
    <>
      <Head>
        <title>Matches</title>
      </Head>
      <Box w={['full', 'container.md']} px={[2, 0]} mx="auto">
        <Checkbox
          colorScheme="green"
          defaultChecked={showFinishedGames}
          onChange={(e) => setShowFinishedGames(e.target.checked)}
        >
          Show finished games
        </Checkbox>
      </Box>
      <Divider my={6} />
      <VStack w={['full', 'container.md']} mx="auto">
        {matches.map((match) => (
          <MatchForm
            showFinishedGames={showFinishedGames}
            key={match.id}
            match={match}
          />
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
