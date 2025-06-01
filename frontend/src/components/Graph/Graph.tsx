import { FC, useMemo } from "react";
import { observer } from "mobx-react";
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

export const Graph: FC<{ data: IDashboardChartData | null | undefined }> =
  observer(({ data }) => {
    // Handle loading/null state
    if (!data) {
      return (
        <div
          style={{
            height: 400,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#666",
          }}>
          Loading chart data...
        </div>
      );
    }

    // Transform data with unique task identifiers
    const { chartData, uniqueTaskKeys } = useMemo(() => {
      const result = transformChartData(data);
      return result;
    }, [data]);

    // Debug output
    console.log("Transformed chart data:", chartData);
    console.log("Unique task keys:", uniqueTaskKeys);

    // Handle empty data case
    if (chartData.length === 0) {
      return (
        <div
          style={{
            height: 400,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#666",
          }}>
          No chart data available
        </div>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis
            label={{
              value: "Power (kWh)",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip
            content={<CustomTooltip data={data} />}
            cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
          />
          <Legend />

          {/* Render each unique task-hour combination as a bar */}
          {uniqueTaskKeys.map((key, idx) => (
            <Bar
              key={key}
              dataKey={key}
              stackId="tasks"
              fill={taskColors[idx % taskColors.length]}
              name={key.split("|")[0]} // Display only task name in legend
            />
          ))}

          {/* Line for power balance */}
          <Line
            type="monotone"
            dataKey="powerBalance"
            name="Net Energy Balance"
            stroke="#ff7300"
            dot
          />
        </ComposedChart>
      </ResponsiveContainer>
    );
  });
