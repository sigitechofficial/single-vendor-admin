// BarChart.js
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Barchart = (props) => {
  const data = {
    labels: props?.label || [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Total Earning (CHF)",
        data: props?.value || [70, 20, 40, 60, 50, 30, 30, 30, 30, 30, 20, 10],
        backgroundColor: "#f45353",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 0, // Thin border
        barThickness: 8, // Controls the bar width
        borderRadius: 20,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true, // Enable the title plugin
        text: "Total Earning (by order)", // The text of the title
        color: "#000",
        font: {
          size: 18, // Font size for the title
          weight: "bold", // You can adjust font weight if needed
        },
        padding: {
          top: 10,
          bottom: 30, // Adjust the spacing below the title
        },
        align: "start", // Align the title to the start (left-aligned)
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 10,
          callback: function (value) {
            return value + " CHF"; // Concatenate "CHF" with the Y-axis values
          },
        },
        grid: {
          display: false, // Disable the grid lines for y-axis
        },
      },
      x: {
        grid: {
          display: false, // Disable the grid lines for x-axis
        },
      },
    },
  };

  return <Bar data={props?.data ? props?.data : data} options={options} />;
};

export default Barchart;
