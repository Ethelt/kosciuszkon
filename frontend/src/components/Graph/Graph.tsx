import { FC } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { transformChartData } from "@/utils/transformChartData";

import { CustomTooltip } from "./CustomTooltip";

// Define an array of colors for the tasks
const taskColors = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#8dd1e1",
  "#a4de6c",
  "#d0ed57",
  "#ffbb28",
  "#ff7300",
  "#413ea0",
];

export const Graph: FC<{ data: IDashboardChartData }> = ({ data }) => {
  console.log(data);
  const chartData = transformChartData(data);

  // Extract all unique task names from all tasks
  const taskNames = [...new Set(data.tasks.map(t => t.name))];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis
          label={{ value: "Power (units)", angle: -90, position: "insideLeft" }}
        />
        <Tooltip
          content={<CustomTooltip data={data} />}
          cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
        />
        <Legend />

        {/* Dynamically render stacked bars for tasks */}
        {taskNames.map((name, idx) => (
          <Bar
            key={name}
            dataKey={name}
            stackId="tasks"
            fill={taskColors[idx % taskColors.length]}
            name={name}
          />
        ))}

        {/* Line for power balance */}
        <Line type="monotone" dataKey="powerBalance" stroke="#ff7300" dot />
      </ComposedChart>
    </ResponsiveContainer>
  );
};
