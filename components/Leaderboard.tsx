import {
  Container,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  StatArrow,
} from '@chakra-ui/react';

const players = [
  {
    name: 'Lorem',
    score: 24,
    lastWeek: 2,
  },
  {
    name: 'Ipsum',
    score: 20,
    lastWeek: 1,
  },
  {
    name: 'Dolor',
    score: 18,
    lastWeek: 3,
  },
  {
    name: 'Sit',
    score: 15,
    lastWeek: 4
  }
];

const Leaderboard: React.FC = () => {
  return (
    <Container maxW="container.lg">
      <Table>
        <Thead>
          <Th>Rank</Th>
          <Th>Player</Th>
          <Th isNumeric>Score</Th>
          <Th isNumeric fontSize={['x-small', 'xs']}>
            Last week
          </Th>
        </Thead>
        <Tbody>
          {players.map((player, i) => {
            const rank = i + 1;
            const trend = rank < player.lastWeek ? 'increase' : 'decrease';

            return (
              <Tr>
                <Td>{rank}</Td>
                <Td>{player.name}</Td>
                <Td isNumeric>{player.score}</Td>
                <Td isNumeric>
                  {rank !== player.lastWeek && <StatArrow type={trend} />}{' '}
                  {player.lastWeek}
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Container>
  );
};

export default Leaderboard;
