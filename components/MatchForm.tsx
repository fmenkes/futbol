import Flag from 'react-flags';
import {
  HStack,
  Box,
  Input,
  Text,
  Button,
  Grid,
  Center,
  FormControl,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Spinner,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { MatchStatus, PredictionResult, Prisma } from '@prisma/client';
import axios from 'axios';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { transformMatchStatus } from 'utils';
import useSWR from 'swr';

const matchWithTeams = Prisma.validator<Prisma.MatchArgs>()({
  include: { homeTeam: true, awayTeam: true },
});

type MatchWithTeams = Prisma.MatchGetPayload<typeof matchWithTeams>;

type Props = {
  match: MatchWithTeams;
};

type FormData = {
  homeTeam: string;
  awayTeam: string;
};

const MatchForm: React.FC<Props> = ({ match }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      homeTeam: '',
      awayTeam: '',
    },
  });

  const [usersMatchBets, setUsersMatchBets] = useState(null);

  const { data } = useSWR('/api/predictions/');

  const onSubmit = handleSubmit((data) => {
    axios.post('/api/predictions/update', {
      ...data,
      matchId: match.id,
    });
  });

  const loadOtherBets = async (id) => {
    if (!usersMatchBets) {
      const response = await axios.get(`/api/predictions/matches/${id}`);
      const bets = response.data;
      setUsersMatchBets(bets);
    }
  };

  const getBgColorForGame = (result) => {
    switch (result) {
      case PredictionResult.PARTIAL:
        return 'yellow';
      case PredictionResult.CORRECT:
        return 'green';
      case PredictionResult.INCORRECT:
        return 'tomato';
      default:
        return 'white';
    }
  };

  useEffect(() => {
    if (data?.find((d) => d.matchId === match.id)) {
      reset({
        homeTeam: `${data.find((d) => d.matchId === match.id)?.homeTeamGoals}`,
        awayTeam: `${data.find((d) => d.matchId === match.id)?.awayTeamGoals}`,
      });
    }
  }, [data]);

  const disabled = () => {
    switch (match.status) {
      case MatchStatus.IN_PLAY:
        return true;
      case MatchStatus.FINISHED:
        return true;
      case MatchStatus.CANCELED:
        return true;
      case MatchStatus.PAUSED:
        return true;
      default:
        return false;
    }
  };

  return (
    <Box w="full">
      <Box p={2}>
        <Text>
          {dayjs(match.utcDate).format('DD/MM HH:mm')}
          {match.matchday && ` - Matchday ${match.matchday}`}
        </Text>
      </Box>
      <Center pb={2} display={['flex', 'none']}>
        <Text fontWeight="bold">
          {match.homeTeam ? match.homeTeam.name : '?'} VS{' '}
          {match.awayTeam ? match.awayTeam.name : '?'}
        </Text>
      </Center>
      <Box bg="gray.100" rounded={['none', 'md']} w="full">
        <form onSubmit={onSubmit}>
          <Grid
            w="full"
            p={[2, 4]}
            templateColumns={['repeat(3, 1fr)', 'repeat(3, 1fr)']}
            gap={2}
          >
            <HStack justifyContent="flex-end">
              <Text display={['none', 'inline-block']}>
                {match.homeTeam?.name}
              </Text>
              <Box h="24px" w="32px">
                <Flag
                  basePath="/flags"
                  name={
                    match.homeTeam ? match.homeTeam.countryCode : '_unknown'
                  }
                  format="svg"
                />
              </Box>
              <FormControl
                w={[disabled() ? 10 : 16, 16]}
                isInvalid={!!errors.homeTeam}
              >
                <Input
                  px={[disabled() ? 2 : 4, 4]}
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
                  disabled={disabled()}
                  bg="white"
                  {...register('homeTeam', { required: true })}
                />
              </FormControl>
            </HStack>
            <Center>
              <Text display={disabled() ? 'block' : 'none'}>
                {match.homeTeamGoals}
              </Text>
              <Button
                disabled={disabled()}
                mx={4}
                colorScheme="teal"
                type="submit"
                textTransform="initial"
              >
                {disabled() ? transformMatchStatus(match.status) : 'Save'}
              </Button>
              <Text display={disabled() ? 'block' : 'none'}>
                {match.awayTeamGoals}
              </Text>
            </Center>
            <HStack justifyContent="flex-start">
              <FormControl
                w={[disabled() ? 10 : 16, 16]}
                isInvalid={!!errors.awayTeam}
              >
                <Input
                  px={[disabled() ? 2 : 4, 4]}
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
                  disabled={disabled()}
                  bg="white"
                  {...register('awayTeam', { required: true })}
                />
              </FormControl>
              <Box h="24px" w="32px">
                <Flag
                  basePath="/flags"
                  name={
                    match.awayTeam ? match.awayTeam.countryCode : '_unknown'
                  }
                  format="svg"
                />
              </Box>
              <Text display={['none', 'inline-block']}>
                {match.awayTeam?.name}
              </Text>
            </HStack>
          </Grid>
        </form>
        {match.status === MatchStatus.IN_PLAY ||
        match.status === MatchStatus.FINISHED ? (
          <Accordion allowMultiple>
            <AccordionItem>
              <h2>
                <AccordionButton onClick={() => loadOtherBets(match.id)}>
                  <Box flex="1" textAlign="center">
                    View player bets
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <Box textAlign="center">
                  {usersMatchBets ? (
                    usersMatchBets.map((userBet) => (
                      <Box
                        key={userBet.id + 'box'}
                        bg={getBgColorForGame(userBet.result)}
                      >
                        <h3 key={userBet.id + 'h3'}>{userBet.user.name}</h3>
                        <p key={userBet.id + 'p'}>
                          {userBet.homeTeamGoals} - {userBet.awayTeamGoals}
                        </p>
                      </Box>
                    ))
                  ) : (
                    <Spinner />
                  )}
                </Box>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        ) : (
          <div></div>
        )}
      </Box>
    </Box>
  );
};

export default MatchForm;
