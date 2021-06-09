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
import { UserScores } from 'pages';

type Props = {
  scores: UserScores[];
};

const Leaderboard: React.FC<Props> = ({ scores }) => {
  const sortedScores = scores
    .map((user) => ({
      ...user,
      totalScore:
        user.scores.length === 0 ? 0 : user.scores.reduce((a, c) => a + c),
    }))
    .sort((a, b) => b.totalScore - a.totalScore);

  return (
    <Container maxW="container.lg">
      <Table>
        <Thead>
          <Th>Rank</Th>
          <Th>Player</Th>
          <Th isNumeric>Score</Th>
        </Thead>
        <Tbody>
          {sortedScores.map((user, i) => {
            const rank = i + 1;
            // const trend = rank < player.lastWeek ? 'increase' : 'decrease';

            return (
              <Tr>
                <Td>{rank}</Td>
                <Td>{user.name}</Td>
                <Td isNumeric>{user.totalScore}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Container>
  );
};

export default Leaderboard;
