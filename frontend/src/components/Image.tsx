import { type FC } from "react";

import type { ImageProps } from "@/types/core";

import style from "@styles/components/Image.module.scss";

export const Image: FC<ImageProps> = ({
  imageClassName,
  containerClassName,
  ...props
}) => {
  return (
    <div
      className={
        containerClassName ? containerClassName : style.imageContainer
      }>
      <img className={imageClassName} {...props} />
    </div>
  );
};
