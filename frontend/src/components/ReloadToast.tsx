import { type FC } from "react";

import { type SWNotificationDataType } from "@/types/types";

import styles from "@styles/components/ReloadToast.module.scss";

export const ReloadToast: FC<SWNotificationDataType> = ({
  title,
  buttonText,
  onConfirm,
}) => {
  return (
    <div className={styles.reloadToast}>
      <div className={styles.reloadToastText}>
        <h2 className={styles.reloadToastTitle}>{title}</h2>
      </div>
      <button
        className={styles.reloadToastButton}
        title={buttonText}
        type="button"
        onClick={() => {
          if (onConfirm) {
            onConfirm();
          }
        }}>
        <span className={styles.reloadToastButtonText}>{buttonText}</span>
      </button>
    </div>
  );
};
