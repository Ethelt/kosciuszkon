import { FC, useContext } from "react";
import { observer } from "mobx-react";

import { StoreContext } from "@/store/StoreContext";

import styles from "@/styles/components/Header.module.scss";

export const Header: FC = observer(() => {
  const store = useContext(StoreContext);
  const { toggleSidebar } = store.AppState;
  return (
    <header className={styles.header}>
      <button onClick={toggleSidebar}>Button</button>
    </header>
  );
});
