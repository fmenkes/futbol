import superjson from 'superjson';
import Leaderboard from '@components/Leaderboard';
import { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { Match, PrismaClient, Prisma } from '@prisma/client';
import { Flex, HStack, SimpleGrid, VStack } from '@chakra-ui/layout';
import React from 'react';
import { Box, Image, Text } from '@chakra-ui/react';
import Flag from 'react-flags';

const prisma = new PrismaClient();

const matchWithTeams = Prisma.validator<Prisma.MatchArgs>()({
  include: { homeTeam: true, awayTeam: true },
});

type MatchWithTeams = Prisma.MatchGetPayload<typeof matchWithTeams>;

type Props = {
  matches: MatchWithTeams[];
};

const Home: NextPage<Props> = ({ matches }) => {
  return (
    <>
      <Head>
        <title>Fútbol</title>
      </Head>
      <Leaderboard />
      {/* TODO: Break out into its own components */}
      <VStack>
        {matches.map((match) => (
          <SimpleGrid w="full" bg="gray.200" p="4" columns={3}>
            <HStack>
              <Box h="24px" w="32px">
                <Flag
                  basePath="/flags"
                  name={
                    match.homeTeam ? match.homeTeam.countryCode : '_unknown'
                  }
                  format="svg"
                />
              </Box>
              <Text>{match.homeTeam?.name}</Text>
            </HStack>
            <Text fontSize="2xl" textAlign="center">VS</Text>
            <HStack justifyContent="flex-end">
              <Text>{match.awayTeam?.name}</Text>
              <Box h="24px" w="32px">
                <Flag
                  basePath="/flags"
                  name={
                    match.awayTeam ? match.awayTeam.countryCode : '_unknown'
                  }
                  format="svg"
                />
              </Box>
            </HStack>
          </SimpleGrid>
        ))}
      </VStack>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
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

export default Home;
