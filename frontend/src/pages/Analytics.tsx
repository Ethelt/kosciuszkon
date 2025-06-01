import { FC, useContext, useEffect } from "react";
import { observer } from "mobx-react";

import { Graph } from "@/components";
import { StoreContext } from "@/store/StoreContext";

export const Analytics: FC = observer(() => {
  const store = useContext(StoreContext);
  const { chartData, getChartData } = store.ChartStateStore;
  useEffect(() => {
    getChartData();
  }, [getChartData]);
  return (
    <div>
      <Graph data={chartData} />
    </div>
  );
});
