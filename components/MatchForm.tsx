import Flag from 'react-flags';
import {
  SimpleGrid,
  HStack,
  Box,
  Input,
  Text,
  Button,
  Grid,
  Center,
  GridItem,
  Tooltip,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { Prisma } from '@prisma/client';
import axios from 'axios';

const matchWithTeams = Prisma.validator<Prisma.MatchArgs>()({
  include: { homeTeam: true, awayTeam: true },
});

type MatchWithTeams = Prisma.MatchGetPayload<typeof matchWithTeams>;

type Props = {
  match: MatchWithTeams;
  data: {
    matchId: number;
    homeTeamGoals: number;
    awayTeamGoals: number;
  }[];
};

type FormData = {
  homeTeam: string;
  awayTeam: string;
};

const MatchForm: React.FC<Props> = ({ match, data }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = handleSubmit((data) => {
    axios.post('/api/predictions/update', {
      ...data,
      matchId: match.id,
    });
  });

  return (
    <Box bg="gray.100" rounded="md" w="full">
      <form onSubmit={onSubmit}>
        <Grid
          w="full"
          p="4"
          templateColumns={['repeat(3, 1fr)', 'repeat(2, 1fr)']}
          gap={4}
        >
          <HStack justifyContent="flex-end">
            <Text display={['none', 'inline-block']}>
              {match.homeTeam?.name}
            </Text>
            <Tooltip label={match.homeTeam?.name}>
              <Box h="24px" w="32px">
                <Flag
                  basePath="/flags"
                  name={
                    match.homeTeam ? match.homeTeam.countryCode : '_unknown'
                  }
                  format="svg"
                />
              </Box>
            </Tooltip>
            <Input
              defaultValue={
                data?.find((d) => d.matchId === match.id)?.homeTeamGoals
              }
              type="number"
              onInput={(e) => {
                e.currentTarget.value = e.currentTarget.value.replace(
                  /[^0-9]/gi,
                  '',
                );
                if (e.currentTarget.value.length > 2) {
                  e.currentTarget.value = e.currentTarget.value.slice(0, 2);
                } else if (
                  e.currentTarget.value.length === 2 &&
                  e.currentTarget.value[0] === '0'
                ) {
                  e.currentTarget.value = e.currentTarget.value.slice(1, 2);
                }
              }}
              bg="white"
              w="16"
              {...register('homeTeam', { required: true })}
            />
          </HStack>
          <Button colorScheme="teal" type="submit">
            Save
          </Button>
          <HStack justifyContent="flex-start">
            <Input
              defaultValue={
                data?.find((d) => d.matchId === match.id)?.awayTeamGoals
              }
              type="number"
              onInput={(e) => {
                e.currentTarget.value = e.currentTarget.value.replace(
                  /[^0-9]/gi,
                  '',
                );
                if (e.currentTarget.value.length > 2) {
                  e.currentTarget.value = e.currentTarget.value.slice(0, 2);
                } else if (
                  e.currentTarget.value.length === 2 &&
                  e.currentTarget.value[0] === '0'
                ) {
                  e.currentTarget.value = e.currentTarget.value.slice(1, 2);
                }
              }}
              bg="white"
              w="16"
              {...register('awayTeam', { required: true })}
            />
            <Box h="24px" w="32px">
              <Flag
                basePath="/flags"
                name={match.awayTeam ? match.awayTeam.countryCode : '_unknown'}
                format="svg"
              />
            </Box>
            <Text display={['none', 'inline-block']}>
              {match.awayTeam?.name}
            </Text>
          </HStack>
          <GridItem display={['none', 'block']} colSpan={2}>
            <Center>
              <Button colorScheme="teal" type="submit">
                Save
              </Button>
            </Center>
          </GridItem>
        </Grid>
      </form>
    </Box>
  );
};

export default MatchForm;
