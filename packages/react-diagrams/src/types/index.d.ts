declare module '*.svg' {
  import React from 'react';

  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;

  export default ReactComponent;
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
