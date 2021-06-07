import Leaderboard from '@components/Leaderboard';
import { NextPage } from 'next';
import Head from 'next/head';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Fútbol</title>
      </Head>
      <Leaderboard />
    </>
  );
};

export default Home;
