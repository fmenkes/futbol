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
          <Tr>
            <Th>Rank</Th>
          </Tr>
          <Tr>
            <Th>Player</Th>
          </Tr>
          <Tr>
            <Th isNumeric>Score</Th>
          </Tr>
        </Thead>
        <Tbody>
          {sortedScores.map((user, i) => {
            const rank = i + 1;
            // const trend = rank < player.lastWeek ? 'increase' : 'decrease';

            return (
              <Tr key={user.name + 'th'}>
                <Td key={user.name + 'rank'}>{rank}</Td>
                <Td key={user.name + 'username'}>{user.name}</Td>
                <Td key={user.name + 'score'} isNumeric>{user.totalScore}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Container>
  );
};

export default Leaderboard;
