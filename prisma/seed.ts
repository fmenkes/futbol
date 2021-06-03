import { PrismaClient } from '@prisma/client';
import axios from 'axios';
const prisma = new PrismaClient();

const fetchTeams = async () => {
  const res = await axios.get(
    'https://api.football-data.org/v2/competitions/EC/teams',
    {
      headers: {
        'X-Auth-Token': process.env.FOOTBALL_DATA_API_TOKEN,
      },
    },
  );

  const { teams } = res.data;

  return teams.map((team) => ({
    id: team.id,
    name: team.name,
    countryCode: team.tla,
  }));
};

const fetchMatches = async () => {
  const res = await axios.get(
    'https://api.football-data.org/v2/competitions/EC/matches',
    {
      headers: {
        'X-Auth-Token': process.env.FOOTBALL_DATA_API_TOKEN,
      },
    },
  );

  const { matches } = res.data;

  return matches.map((match) => ({
    id: match.id,
    utcDate: match.utcDate,
    status: match.status,
    stage: match.stage,
    group: match.group,
    matchday: match.matchday,
    homeTeamId: match.homeTeam.id,
    awayTeamId: match.awayTeam.id,
  }));
};

async function main() {
  const fetchedTeams = await fetchTeams();
  await prisma.team.createMany({
    data: fetchedTeams,
    skipDuplicates: true,
  });

  const fetchedMatches = await fetchMatches();

  await prisma.match.createMany({
    data: fetchedMatches,
    skipDuplicates: true,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
