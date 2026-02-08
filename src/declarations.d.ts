declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.svg?react" {
  import React from "react";
  const SVG: React.VFC<React.SVGProps<SVGSVGElement>>;
  export default SVG;
}

declare module "*.mp3" {
  const src: string;
  export default src;
}

declare module "*.png" {
  const value: string;
  export default value;
}
