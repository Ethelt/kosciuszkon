export const transformChartData = (
  data: IDashboardChartData | null | undefined,
) => {
  // Provide default structure if data is missing
  const safeData = {
    hours: data?.hours || [],
    tasks: data?.tasks || [],
  };

  console.log("transform", data);

  const { hours, tasks } = safeData;

  console.log("Hours:", hours);
  console.log("Tasks:", tasks);

  // Early return if no hours data
  if (hours.length === 0) {
    return [];
  }

  // Group tasks by hourIndex (safe even with empty tasks array)
  const taskGroups = tasks.reduce<Record<number, IChartTask[]>>((acc, task) => {
    if (task?.hourIndex !== undefined) {
      acc[task.hourIndex] = acc[task.hourIndex] || [];
      acc[task.hourIndex].push(task);
    }
    return acc;
  }, {});

  // Generate combined chart data
  const chartData = hours.map((hour, index) => {
    const hourTasks = taskGroups[index] || [];
    const taskUsages = hourTasks.reduce(
      (acc, task) => {
        if (task?.name && task?.estimatedUsage !== undefined) {
          acc[task.name] = task.estimatedUsage;
        }
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      time: hour?.label || `Hour ${index}`,
      powerBalance: hour?.balance || 0,
      ...taskUsages,
    };
  });

  return chartData;
};
