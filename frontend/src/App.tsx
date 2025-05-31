import { type FC } from "react";
import { observer } from "mobx-react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";

import { PWAToasts } from "@/components";
import { DashboardPage, NotFoundPage } from "@/pages";

const App: FC = observer(() => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
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
      </BrowserRouter>
    </>
  );
});

export default App;
