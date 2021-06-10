import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Container } from "@chakra-ui/react";
import { UserScores } from 'pages';

type Props = {
  scores: UserScores[];
};

const options = {
  scales: {
    y: {
      suggestedMin: 0,
      suggestedMax: 15
    }
  },
};

const StatChart: React.FC<Props> = ({ scores }) => {
  const [betData, setBetData] = useState(null);

  function getRandomColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let colour = '#';
    for (let i = 0; i < 3; i++) {
      let value = (hash >> (i * 8)) & 0xFF;
      colour += ('00' + value.toString(16)).substr(-2);
    }
    return hexToRgb(colour);
  }

  function hexToRgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return (parseInt(result[1], 16) + ', ' + parseInt(result[2], 16) + ',' + parseInt(result[3], 16))
  }

  function organizeUserScore(userScores) {      
    {        
      for (let i = 1; i < 7; i++) {
        userScores[i] += userScores[i - 1];
      }
    }
    return userScores;
  }

  useEffect(() => {
    let bettingData = scores.map((user) => {
      let userColor = getRandomColor(user.name);
      return {
        label: user.name,
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(' + userColor + ')',
        borderColor: 'rgba(' + userColor + ')',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(' + userColor + ')',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(' + userColor + ')',
        pointHoverBorderColor: 'rgba(' + userColor + ')',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: organizeUserScore(user.scores)
      }
    })

    setBetData(
      {
        labels: [
          'Matchday 1',
          'Matchday 2',
          'Matchday 3',
          'Round of 16',
          'Quarter Finals',
          'Semi Finals',
          'Final'
        ],
        datasets: bettingData
      }
    );
  }, []);

  return (
    <>
      <Container maxW="container.md">
        <Line
          type={'line'}
          data={betData}
          width={400}
          height={400}
          options={options}
        />
      </Container>
    </>
  );
};

export default StatChart;

