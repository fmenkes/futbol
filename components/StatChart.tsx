import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Container } from "@chakra-ui/react";
import { UserScores } from 'pages';

type Props = {
  scores: UserScores[];
};

const data = {
  labels: ['Matchday 1', 'Matchday 2', 'Matchday 3', 'Round of 16', 'Quarter Finals', 'Semi Finals', 'Final'],
  datasets: [
    {
      label: 'My First dataset',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [65, 59, 80, 81, 56, 55, 40]
    }
  ]
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
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = '#';
    for (var i = 0; i < 3; i++) {
      var value = (hash >> (i * 8)) & 0xFF;
      colour += ('00' + value.toString(16)).substr(-2);
    }
    return hexToRgb(colour);
  }

  function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return (parseInt(result[1], 16) + ', ' + parseInt(result[2], 16) + ',' + parseInt(result[3], 16))
  }


  useEffect(() => {
    let bettingData = scores.map((user) => {
      var userColor = getRandomColor(user.name);
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
        data: user.scores
      }
    })

    setBetData(
      {
        labels: ['Matchday 1', 'Matchday 2', 'Matchday 3', 'Round of 16', 'Quarter Finals', 'Semi Finals', 'Final'],
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

