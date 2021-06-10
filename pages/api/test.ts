import { getSession } from 'next-auth/client';
import { PredictionResult, PrismaClient } from '@prisma/client';
import prisma from '@lib/prisma';
import dayjs from 'dayjs';

const prismaClient = new PrismaClient();

export default async (req, res) => {
  res.send(dayjs().toISOString);
};
