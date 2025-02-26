import React from 'react';
import './index.scss';
import {Doughnut} from "react-chartjs-2";
import {ArcElement, Chart as ChartJS, Legend, Tooltip} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const Index = ({ tasks }) => {
  
  const allTasks = tasks.length;
  const completedTasks = tasks.filter((item) => item.isCompleted).length
  const progress = allTasks && completedTasks ? Math.round((completedTasks / allTasks) * 100) : 0
  
  const data = {
    datasets: [
      {
        data: [progress, 100 - progress],
        backgroundColor: ["#ADFF00", "transparent"],
        borderWidth: 0,
      },
    ],
  };
  
  const options = {
    cutout: "83%",
    rotation: -90,
    circumference: 360,
    responsive: true,
    plugins: {
      tooltip: { enabled: false },
      legend: { display: false },
    },
  };
  
  return (
      <div className='statistic'>
        <Doughnut data={data} options={options} />
        <div className='statistic__title'>
          Progress <span className='statistic__progress'>{progress}%</span>
        </div>
      </div>
  );
};

export default Index;
