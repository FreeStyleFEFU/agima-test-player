declare module "*.svg" {
  import { FC, SVGProps } from "react";
  export const ReactComponent: FC<SVGProps<SVGSVGElement>>;
  export const value: string;
  const src: string;
  export default src;
}

declare module "*.png" {
  const value: string;
  export = value;
}
