import { forwardRef } from "react";
import ResizeIcon from "@assets/icons/resizeSolid.svg?react";

import styles from "@styles/components/ResizableHandle.module.scss";

export const ResizableHandle = forwardRef<
  HTMLInputElement,
  { handleAxis?: string }
>((props, ref) => {
  const { handleAxis, ...restProps } = props;
  return (
    <div
      ref={ref}
      className={`${styles.handle} react-resizable-handle handle-${handleAxis}`}
      {...restProps}>
      <ResizeIcon className={styles.handleIcon} />
    </div>
  );
});
