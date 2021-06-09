// import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import dynamic from 'next/dynamic'

const StatChart = dynamic(() => import('../components/StatChart'))

const Stats: NextPage = () => {
    return (
        <>
            <Head>
                <title>Stats</title>
            </Head>
            <StatChart />
        </>
    );
};

export default Stats;