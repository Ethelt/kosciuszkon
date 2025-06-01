import { FC } from "react";
import { Plus } from "lucide-react";
import { NavLink } from "react-router-dom";

import styles from "@/styles/components/AddTaskButton.module.scss";

export const AddTaskButton: FC = () => {
  return (
    <div className={styles.buttonContainer}>
      <NavLink
        state={{ taskId: null }}
        to="/tasks/add"
        className={styles.button}>
        <Plus />
        <span className={styles.buttonText}>Add&nbsp;Task</span>
      </NavLink>
    </div>
  );
};
