export const transformChartData = (data: IDashboardChartData) => {
  const { hours, tasks } = data;

  console.log(hours, tasks);

  // Group tasks by hourIndex
  const taskGroups = tasks.reduce<Record<number, IChartTask[]>>((acc, task) => {
    acc[task.hourIndex] = acc[task.hourIndex] || [];
    acc[task.hourIndex].push(task);
    return acc;
  }, {});

  // Generate combined chart data
  const chartData = hours.map((hour, index) => {
    const hourTasks = taskGroups[index] || [];
    const taskUsages = hourTasks.reduce(
      (acc, task) => {
        acc[task.name] = task.estimatedUsage;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      time: hour.label,
      powerBalance: hour.balance,
      ...taskUsages,
    };
  });

  return chartData;
};
