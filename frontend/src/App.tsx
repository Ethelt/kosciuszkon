import { type FC, useContext, useEffect } from "react";
import { observer } from "mobx-react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";

import { PWAToasts } from "@/components";
import {
  AddTaskPage,
  DashboardPage,
  InfrastructurePage,
  NavigationWrapper,
  NotFoundPage,
  TasksPage,
} from "@/pages";

import { StoreContext } from "./store/StoreContext";

const App: FC = observer(() => {
  const location = useLocation();
  const store = useContext(StoreContext);
  const { setCurrentPage } = store.AppState;

  useEffect(() => {
    setCurrentPage(location.pathname);
  }, [location, setCurrentPage]);
  return (
    <>
      <Routes>
        <Route path="/" element={<NavigationWrapper />}>
          <Route index element={<DashboardPage />} />
          <Route path="infrastructure" element={<InfrastructurePage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="tasks/add" element={<AddTaskPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <PWAToasts />
      <ToastContainer
        position="bottom-left"
        autoClose={false}
        newestOnTop
        theme="dark"
        transition={Bounce}
      />
    </>
  );
});

export default App;
