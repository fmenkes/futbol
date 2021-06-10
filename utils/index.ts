import { MatchStatus } from '.prisma/client';
import { ProjectedResult } from '@prisma/client';

export const transformMatchStatus = (status: MatchStatus) => {
  switch (status) {
    case 'AWARDED':
      return 'Awarded';
    case 'CANCELED':
      return 'Canceled';
    case 'FINISHED':
      return 'Finished';
    case 'IN_PLAY':
      return 'In play';
    case 'PAUSED':
      return 'Paused';
    case 'POSTPONED':
      return 'Postponed';
    case 'SCHEDULED':
      return 'Scheduled';
    case 'SUSPENDED':
      return 'Suspended';
    default:
      return '?';
  }
};

export const getProjectedResult = (
  homeTeamGoals: number,
  awayTeamGoals: number,
) => {
  const oneXTwo = homeTeamGoals - awayTeamGoals;

  return oneXTwo > 0
    ? ProjectedResult.HOME_TEAM
    : oneXTwo === 0
    ? ProjectedResult.DRAW
    : oneXTwo < 0
    ? ProjectedResult.AWAY_TEAM
    : ProjectedResult.DRAW;
};
