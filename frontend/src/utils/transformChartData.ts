export const transformChartData = (
  data: IDashboardChartData | null | undefined,
) => {
  // Provide default structure if data is missing
  if (!data || !data.hours || !data.tasks) {
    console.warn("Missing or invalid chart data");
    return { chartData: [], uniqueTaskKeys: [] };
  }

  const { hours, tasks } = data;

  // Early return if no hours data
  if (!Array.isArray(hours) || hours.length === 0) {
    console.warn("No hours data available");
    return { chartData: [], uniqueTaskKeys: [] };
  }

  // Create unique task keys for each task instance
  // Format: taskName|hourIndex|taskId
  const uniqueTaskKeys = new Set<string>();

  // Initialize chart data with time and powerBalance
  const chartData = hours.map((hour, hourIndex) => {
    const hourObj: {
      time: string;
      powerBalance: number;
      [key: string]: string | number;
    } = {
      time: hour.label || `Hour ${hourIndex}`,
      powerBalance: hour.balance || 0,
    };

    // Find tasks for this hour
    const hourTasks = tasks.filter(task => task.hourIndex === hourIndex);

    // Add each task to the hour data with a unique key
    hourTasks.forEach((task, taskIndex) => {
      // Create a unique key that includes the hour
      const uniqueKey = `${task.name}|${hourIndex}|${task.id || taskIndex}`;
      uniqueTaskKeys.add(uniqueKey);

      // Add this task's power usage to the hour data
      hourObj[uniqueKey] = task.estimatedUsage || 0;
    });

    return hourObj;
  });

  console.log("Transformed chart data:", chartData);

  // Convert set to array for the component
  const uniqueTaskKeysArray = Array.from(uniqueTaskKeys);

  return {
    chartData,
    uniqueTaskKeys: uniqueTaskKeysArray,
  };
};
