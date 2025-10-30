import React, { useEffect, useRef } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dounut = ({ dataList, text }) => {
  const chartRef = useRef(null);
  const textRef = useRef(text); // Keep latest text in a ref

  useEffect(() => {
    textRef.current = text; // Update ref when text changes
    if (chartRef.current) {
      chartRef.current.update(); // Re-render the chart to draw new text
    }
  }, [text]);

  const centerTextPlugin = {
    id: "centerTextPlugin",
    afterDraw(chart) {
      const { ctx, chartArea } = chart;
      const { left, right, top, bottom } = chartArea;
      const width = right - left;
      const height = bottom - top;

      ctx.save();
      const fontSize = (height / 90).toFixed(2); // Adjust this based on your taste
      ctx.font = `${fontSize}em sans-serif`;
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";

      const displayText = textRef.current ?? "0";
      const textX = left + width / 2;
      const textY = top + height / 2;

      ctx.fillText(displayText, textX, textY);
      ctx.restore();
    },
  };

  const data = {
    labels: ["Online", "Cash"],
    datasets: [
      {
        data: dataList || [85, 15],
        backgroundColor: ["#007bff", "#fd7e14"],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: "85%",
    plugins: {
      legend: {
        display: true,
        position: "bottom",
      },
    },
  };

  return (
    <Doughnut
      ref={chartRef}
      data={data}
      options={options}
      plugins={[centerTextPlugin]}
    />
  );
};

export default Dounut;
