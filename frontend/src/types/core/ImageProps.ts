export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  imageClassName?: string;
  containerClassName?: string;
  onClick?: () => void;
}
