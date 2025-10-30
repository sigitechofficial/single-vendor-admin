import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        padding: 20,
      },
    },
  },
  //   layout: {
  //     padding: {
  //       top: 20,
  //       bottom: 20,
  //       left: 20,
  //       right: 20,
  //     },
  //   },
};

export function DonutChart(props) {
  return (
    <Doughnut data={props.data} options={options} width={100} height={100} />
  );
}
