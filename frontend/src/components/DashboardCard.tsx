import { type FC, useEffect, useRef } from "react";

import styles from "@styles/components/DashboardCard.module.scss";

interface DashboardCardProps {
  id: string;
  title: string;
  isEditMode?: boolean;
  onHeightChange: (id: string, pixelHeight: number) => void;
}
export const DashboardCard: FC<DashboardCardProps> = ({
  id,
  title,
  isEditMode,
  onHeightChange: onHeightChangeCallback,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current && onHeightChangeCallback) {
      const height = cardRef.current.offsetHeight;
      onHeightChangeCallback(id, height);
    }
  }, [id, onHeightChangeCallback, title]);

  return (
    <div
      ref={cardRef}
      onClick={() => {
        if (isEditMode) return;
        alert(title);
      }}
      className={styles.card}>
      <h2 className={styles.cardTitle}>{title}</h2>
    </div>
  );
};
