import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const DrawLineChart = (linedata, height, red, blue, green) => {
  return (
    <ResponsiveContainer width="95%" height={height}>
      <LineChart
        data={linedata}
        margin={{ top: 5, right: 0, bottom: 20, left: 0 }}
        fontSize="0.8em"
      >
        <Line
          type="monotone"
          dataKey="red_team"
          name={red}
          stroke="#bf2626"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="blue_team"
          name={blue}
          stroke="#2db2e3"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="green_team"
          name={green}
          stroke="#40bf26"
          strokeWidth={2}
          dot={false}
        />
        <CartesianGrid
          strokeDasharray={"1 0.5"}
          opacity={"20%"}
          fill="#4A4A4A"
          fillOpacity={0.4}
        />
        <XAxis
          dataKey={"id"}
          label={{
            value: "Skirmish number",
            position: "bottom",
            offset: 5,
            fill: "#fff",
          }}
          stroke="#fff"
        />
        <YAxis
          label={{
            position: "left",
            offset: 0,
            angle: -90,
            fill: "#fff",
          }}
          stroke="#fff"
        />
        <Tooltip />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default DrawLineChart;
